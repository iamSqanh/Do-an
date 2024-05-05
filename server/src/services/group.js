import db from "../models";

async function createChat({message, groupId, userId}) {
    try {
        // Tạo một tin nhắn mới trong bảng Chats
        const chat = await db.Chat.create({ message, groupId, userId });

        // Trả về tin nhắn đã được tạo
        return { success: true, chat };
    } catch (error) {
        console.error('Error creating chat:', error);
        return { success: false, message: 'Error creating chat' };
    }
}

async function getChatsByGroup({groupId, limit, skip}) {
  try {
    // Tìm tất cả các tin nhắn với groupId tương ứng
    const chats = await db.Chat.findAll({
      where: { groupId },
      attributes: ['userId', 'message', 'groupId'], // Chọn các trường cần lấy từ bảng Chat,
      limit, // Số lượng tin nhắn cần lấy
      offset: skip, // Số lượng tin nhắn cần bỏ qua
    });

    return chats;
  } catch (error) {
    console.error('Error getting chats by group:', error);
    throw error;
  }
}

export { createChat, getChatsByGroup }