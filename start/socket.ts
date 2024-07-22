import MongoService from 'App/Services/MongoService'
import Ws from 'App/Services/Ws'
import connect from "Config/mongo";
Ws.boot()

Ws.io.on('connection', async (socket) => {
  const mongoService = MongoService
  const engine = Ws.io.engine;
  const client = socket.id
  
  mongoService.on('change', (data) => {
    socket.emit('data:listen', {
      data,
      type:"lastData",
    })
    socket.broadcast.emit('data:listen', {
      data,
      type:"lastData",
  })
    console.log("lastdata:"+data)
  })
  

  var db = await connect();
    const col = await db.collection("Dispositives")
    var lastData = await col.watch([
        { $match: { "DispositiveID": 2 } }
      ])

    lastData.on('change', (next) => {
        console.log('Change detected:', next);
        // Process the change (you can add more processing logic here)
        lastData = next;
      });

  engine.on('close', async () => {
    console.log("cerrado")
    await mongoService.CloseLastData()
  })
  

  socket.on('data:emit', async (data:any) => {
    await col.updateOne({DispositiveID: 2}, { $set: { name: data } })
    switch (data.type){

      // emits de la pagina web
      case "AllData":
        break
      case "updateFilter":
        break
      case "WatchLastData":
        mongoService.WatchLastData(data.dispositiveID,data.sensorID)
        break
    }
  })
})
