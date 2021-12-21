const express = require("express");

// Setup Express server
const app = express();
const http = require("http").Server(app);

// Attach Socket.io to server
const io = require("socket.io")(http);

// Serve web app directory
app.use(express.static("public"));

// INSERT SOCKET.IO CODE HERE
/** Manage behavior of each client socket connection */
io.on("connection", (socket) => {
  console.log(`User Connected - Socket ID ${socket.id}`);

  // Store the room that the socket is connected to
  let currentRoom = "DEFAULT";

  /** Process a room join request. */
  socket.on("JOIN", (roomName) => {
    socket.join(currentRoom);

    // Notify user of room join success
    io.to(socket.id).emit("ROOM_JOINED", currentRoom);

    // Notify room that user has joined
    socket.broadcast.to(currentRoom).emit("NEW_CONNECTION", null);
  });

  /** Broadcast a received message to the room */
  socket.on("MESSAGE", (msg) => {
    console.log(`New Message - ${msg.text}`);
    socket.broadcast.to(currentRoom).emit("MESSAGE", msg);
  });

  /** Broadcast a new publickey to the room */
  socket.on("PUBLIC_KEY", (key) => {
    socket.broadcast.to(currentRoom).emit("PUBLIC_KEY", key);
  });

  /** Broadcast a disconnection notification to the room */
  socket.on("disconnect", () => {
    socket.broadcast.to(currentRoom).emit("USER_DISCONNECTED", null);
  });
});

// Start server
const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.log(`Chat server listening on port ${port}.`);
});
