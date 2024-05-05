import express from 'express';
import http from 'http'; // Import http module
require('dotenv').config();
import cors from 'cors';
import initRoutes from './src/routes';
import connectDatabase from './src/config/connectDatabase';
import { sequelize } from './src/models';
import { createChat } from './src/services/group';

const app = express();
const server = http.createServer(app); // Create server using Express app

const io = require("socket.io")(server, { // Use the server created by Express
  cors: { origin: "*" },
});

// Lưu trữ thông tin nhóm
const groups = {};

// Xử lý kết nối của người dùng
io.on('connection', (socket) => {
    // Xác định và tham gia nhóm
    socket.on('joinGroup', async (group) => {
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(socket.id);
        socket.join(group);
    });

    // Gửi tin nhắn đến nhóm cụ thể
    socket.on('recMessage', async(data) => {
        const res = await createChat(data)
        if(res) {
            const {groupId} = data
            io.to(groupId).emit('recMessage', data);
        }
    });

    // Xử lý ngắt kết nối
    socket.on('disconnect', (groupId) => {
        // Loại bỏ người dùng ra khỏi tất cả các nhóm
        Object.keys(groups).forEach((group) => {
            groups[group] = groups[group].filter((id) => id !== groupId);
            if (groups[group].length === 0) {
                delete groups[group];
            }
        });
        
    });
    socket.on('leaveGroup', (groupId) => {
        socket.leave(groupId);
        // Loại bỏ người dùng ra khỏi nhóm
    });
});

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", 'GET', 'PUT', "DELETE"]
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

initRoutes(app)
connectDatabase()

const port = process.env.PORT || 5000;
server.listen(port, () => { // Use server.listen instead of app.listen
    console.log(`Server is running on the port ${port}`);
});
