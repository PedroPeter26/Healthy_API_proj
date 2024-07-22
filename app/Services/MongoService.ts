import connect from "Config/mongo";
const EventEmitter = require('events')

class MongoService extends EventEmitter{
    private db: any
    public dataCursors = new Array()

    constructor() {
        super()
        this.init()
    }

    async init() {
        try {
            this.db = await connect();
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
    }

    private async ensureInit() {
        if (!this.db) {
          await this.init();
        }
    }

    public async getCollection(collectionName: string) {
        await this.ensureInit();
        if (!this.db) {
            throw new Error('Failed to connect to the database.');
        }
        return this.db.collection(collectionName)
    }

    // * General purpose CRUD funcs.

    public async findOne(collectionName: string, query: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.findOne(query);
    }
    
    public async findMany(collectionName: string, query: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.find(query).toArray();
    }
    
    public async insertOne(collectionName: string, document: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.insertOne(document);
    }
    
    public async insertMany(collectionName: string, documents: any[]) {
        const collection = await this.getCollection(collectionName);
        return await collection.insertMany(documents);
    }
    
    public async deleteOne(collectionName: string, query: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.deleteOne(query);
    }
    
    public async deleteMany(collectionName: string, query: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.deleteMany(query);
    }
    
    public async updateOne(collectionName: string, query: any, update: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.updateOne(query, { $set: update });
    }
    
    public async updateMany(collectionName: string, query: any, update: any) {
        const collection = await this.getCollection(collectionName);
        return await collection.updateMany(query, { $set: update });
    }

    // * General purpose Aggregation @Func

    public async aggregate(collectionName: string, pipeline: any[]) {
        const collection = await this.getCollection(collectionName)
        return await collection.aggregate(pipeline).toArray()
    }

    public async pushDataToSensor(dispositiveID: number, sensorID: number, Data: any) {
        const collection = await this.getCollection('Dispositives')
        return await collection.updateOne(
            { DispositiveID: dispositiveID, 'Sensors.sensorID': sensorID },
            { $push: { 'Sensors.$.data': Data } }
        )
    }

    
    async getSensorLastData(dispositiveID: number, sensorID: number) {
        let agg = [
            { '$match': { 'DispositiveID': dispositiveID } },
            { '$unwind': '$Sensors' },
            { '$match': { 'Sensors.sensorID': sensorID } },
            { '$unwind': '$Sensors.data' },
            { '$sort': { 'Sensors.data.timestamp': -1 } },
            { '$limit': 1 },
            { '$project': {
                '_id': 0,
                'value': '$Sensors.data.value',
                'unit': '$Sensors.unit',
                'sensorID': '$Sensors.sensorID',
                'dispositiveID': '$DispositiveID',
                'timestamp': '$Sensors.data.timestamp',
                'userID': '$userID'
              }
            }
          ]
        return await this.aggregate('Dispositives', agg)
    }

    

    public getSensorLastDataAgg(userID: number){
        return [
            {
              $match: {
                userID: userID
              }
            },
            {
              $project: {
                DispositiveID: 1,
                name: 1,
                Sensors: {
                  $map: {
                    input: "$Sensors",
                    as: "sensor",
                    in: {
                      sensorID: "$$sensor.sensorID",
                      sensorType: "$$sensor.sensorType",
                      unit: "$$sensor.unit",
                      lastData: {
                        $arrayElemAt: ["$$sensor.data", -1]
                      }
                    }
                  }
                },
                type: 1,
                userID: 1
              }
            }
          ]
    }
    
  async WatchLastData(dispositiveID: number, sensorID: number, client: any) {

    const col = await this.getCollection("Dispositives")
    const changeStream = await col.watch([
        { $match: { 'fullDocument.DispositiveID': dispositiveID } },
        { $match: { 'operationType': 'update' } }
      ],
      { fullDocument: "updateLookup" }
    );

    this.dataCursors.push({ data: changeStream, client: client })

    changeStream.on('change', (next: any) => {
        const fullDocument = next.fullDocument
        if (!fullDocument) return
        const sensor = fullDocument.Sensors.find((sensor: any) => sensor.sensorID === sensorID)
        if (sensor) {
            this.emit('sendChange',{
                data: sensor.data[sensor.data.length - 1],
                sensorID: sensorID,
                client: client,
                type: "lastData"
            })
        }
    })

  }

    async WatchAllData(dispositiveID: number, client: any) {
        const col = await this.getCollection("Dispositives")
        const changeStream = await col.watch([
                { $match: { 'fullDocument.DispositiveID': dispositiveID } },
                { $match: { 'operationType': 'update' } }
            ],
            { fullDocument: "updateLookup" }
        )
    
        this.dataCursors.push({ data: changeStream, client: client })
    
        changeStream.on('change', (next: any) => {
            const fullDocument = next.fullDocument
            fullDocument.Sensors.forEach((sensor: any) => {
                if (sensor.data && sensor.data.length > 0) {
                  sensor.data = sensor.data[sensor.data.length - 1];
                }
              })
            if (!fullDocument) return
            this.emit('sendChange',{
                data: fullDocument.Sensors,
                dispositiveID: dispositiveID,
                client: client,
                type: "AllData"
            })
            
        })
    
    }

  async CloseDataCursor(client: any) {
    for (let i = 0; i < this.dataCursors.length; i++) {
      if (this.dataCursors[i].client === client) {
        await this.dataCursors[i].data.close()
        this.dataCursors.splice(i, 1)
      }
    }
  }
}

export default new MongoService()