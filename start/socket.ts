import MongoService from 'App/Services/MongoService'
import Ws from 'App/Services/Ws'
Ws.boot()

Ws.io.on('connection', async (socket) => {
  const mongoService = MongoService
  const client = socket.id
  
  mongoService.on('sendChange', (data) => {
    if(data.client == client){
      socket.emit('data:listen', data)
    }
  })

  socket.on('disconnect', async () => {
    await mongoService.CloseDataCursor(client)
  })

  socket.on('data:emit', async (data:any) => {
    switch (data.type){
      case "WatchAllData":
        mongoService.WatchAllData(data.dispositiveID,client)
        break
      case "WatchLastData":
        mongoService.WatchLastData(data.dispositiveID,data.sensorID,client)
        break
    }
  })
})
