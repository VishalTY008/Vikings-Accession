const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

initSocket(io);

connectDB().then(() => {
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
});
