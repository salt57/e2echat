const express = require('express')

// Setup Express server
const app = express()
const http = require('http').Server(app)

// Attach Socket.io to server
const io = require('socket.io')(http)

// Serve web app directory
app.use(express.static('public'))

// INSERT SOCKET.IO CODE HERE
/** Manage behavior of each client socket connection */
io.on('connection', (socket) => {
    console.log(`User Connected - Socket ID ${socket.id}`)
  
    // Store the room that the socket is connected to
    let currentRoom = 'DEFAULT'
  
    /** Process a room join request. */
    socket.on('JOIN', (roomName) => {
      socket.join(currentRoom)
  
      // Notify user of room join success
      io.to(socket.id).emit('ROOM_JOINED', currentRoom)
  
      // Notify room that user has joined
      socket.broadcast.to(currentRoom).emit('NEW_CONNECTION', null)
    })
  
    /** Broadcast a received message to the room */
    socket.on('MESSAGE', (msg) => {
      console.log(`New Message - ${msg}`)
      socket.broadcast.to(currentRoom).emit('MESSAGE', msg)
    })
  })

// Start server
const port = process.env.PORT || 3000
http.listen(port, () => {
  console.log(`Chat server listening on port ${port}.`)
})