const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let userCount = 0;

io.on("connection", (socket) => {
  userCount++;
  socket.username = `User${userCount}`;

  console.log(`${socket.username} connected`);

  // Notify others when user joins
  io.emit("chat message", {
    system: true,
    text: `${socket.username} joined the chat`,
  });

  // Handle messages
  socket.on("chat message", (msg) => {
    io.emit("chat message", {
      system: false,
      user: socket.username,
      text: msg,
      senderId: socket.id,
    });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    io.emit("chat message", {
      system: true,
      text: `${socket.username} left the chat`,
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
