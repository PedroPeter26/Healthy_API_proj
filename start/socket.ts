import Ws from 'App/Services/Ws'
Ws.boot()

/**
 * Listen for incoming socket connections
 */
Ws.io.on('connection', (socket) => {
  const client = socket.id
  console.log(client)
  
  socket.on('data:emit', (data) => {
    console.log(data)
    socket.emit('data:listener', data)
    socket.broadcast.emit('data:listener', data)
  })
})
