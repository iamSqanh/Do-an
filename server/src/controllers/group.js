const db = require('../models')
const asyncHandler = require('express-async-handler');
const { getChatsByGroup } = require('../services/group');

const createOrOpenChat = asyncHandler(async (req, res) => {
    try {
        const userIds = req.body
        if(userIds[0].id == userIds[1].id) 
        return res.json({
            success: false,
            mes: 'Cannot chat with yourself!',
            group: group

        })
        const [results, metadata] = await db.sequelize.query(`
            SELECT g.id, g.name
            FROM groups g
            INNER JOIN userGroups ug ON g.id = ug.groupId
            WHERE ug.userId IN (:userId1, :userId2)
            GROUP BY g.id, g.name
            HAVING COUNT(DISTINCT ug.userId) = 2
        `, {
            replacements: { userId1: userIds[0].id, userId2: userIds[1].id },
            type: db.sequelize.QueryTypes.SELECT
        });
        if(results) {
            return res.json({
                success: results ? true : false,
                mes: 'open group',
                group: results || 'no data'
            })            
        } 
        const group = await db.Group.create({ name: userIds[0].name + userIds[1].name });

        // Tạo các liên kết giữa người dùng và nhóm
        for (const userId of userIds) {
            await db.UserGroup.create({ userId: userId.id, groupId: group.id });
        }

        return res.json({
            success: group ? true : false,
            mes: 'Created group',
            group: group

        })
    } catch (error) {
        console.error('Error creating group with users:', error);
    }
})

const getGroupInfo = asyncHandler(async (req, res) => {
    try {
        const userIds = req.body
        // Truy vấn các nhóm chứa đủ danh sách người dùng đã cho
        const groups = await db.Group.findAll({
            include: [{
                model: db.UserGroup,
                as: 'userGroups', // Sử dụng alias 'userGroups' cho mối quan hệ
                where: { userId: userIds }, // Chỉ lấy các bản ghi có userId nằm trong danh sách userIds
                attributes: ['groupId'], // Chỉ lấy thuộc tính groupId của bảng UserGroup
                group: ['groupId'], // Nhóm kết quả theo groupId
                having: db.sequelize.literal(`COUNT(*) = ${userIds.length}`) // Chỉ lấy nhóm có số lượng userIds bằng với độ dài của userIds
            }]
        });

        // Trả về các nhóm chứa đủ danh sách người dùng đã cho
        return { success: true, groups };
    } catch (error) {
        console.error('Error getting groups by users:', error);
        return { success: false, message: 'Error getting groups by users' };
    }
})

const getChatList = asyncHandler(async (req, res) => {
    try {
        const {groupId, limit, skip} = req.body
        // Truy vấn các nhóm chứa đủ danh sách người dùng đã cho
        const data = await getChatsByGroup({groupId, limit, skip})
        // Trả về các nhóm chứa đủ danh sách người dùng đã cho
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error getting groups by users:', error);
        return { success: false, message: 'Error getting groups by users' };
    }
})

const getGroupList = asyncHandler(async (req, res) => {
    try {
        const userId = req?.params?.uid
        const groups = await db.UserGroup.findAll({
          where: { userId }, // Lọc dữ liệu theo userId
          include: [{
            model: db.Group, // Join với bảng Groups
            as: 'groupData', // Đặt tên bí danh phù hợp với định nghĩa của mối quan hệ
            required: true // Đảm bảo rằng kết quả chỉ bao gồm các nhóm mà có ít nhất một bản ghi trong bảng UserGroups tương ứng
          }],
        });
        return res.status(200).json(groups.map(group => group.groupData)); // Trả về danh sách các nhóm
    } catch (error) {
        console.error('Error getting groups by userId:', error);
        throw error; // Xử lý lỗi nếu có
    }
});

const getUserGroup = asyncHandler(async (req, res) => {
    try {
        const groupId = req?.params?.gid
        // Tìm tất cả các bản ghi trong UserGroup có groupId tương ứng
        const userGroups = await db.UserGroup.findAll({
          where: {
            groupId: groupId
          }
        });
    
        // Mảng để lưu trữ thông tin người dùng từ mỗi UserGroup
        let users = [];
    
        // Lặp qua các bản ghi UserGroup và lấy thông tin của người dùng từ mỗi bản ghi
        for (const userGroup of userGroups) {
          const userId = userGroup.userId;
          // Tìm thông tin của người dùng từ userId
          const user = await db.User.findByPk(userId);
          if (user) {
            // Nếu người dùng được tìm thấy, thêm vào mảng users
            users.push(user);
          }
        }
    
        res.status(200).json(users)
      } catch (error) {
        console.error('Error fetching users in group:', error);
        throw error;
      }
})


module.exports = {
    createOrOpenChat, getGroupInfo, getChatList, getGroupList, getUserGroup
}