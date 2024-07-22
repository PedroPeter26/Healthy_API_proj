import connect from "Config/mongo";
const EventEmitter = require('events')

class MongoService extends EventEmitter{
    private db: any
    private lastData: any

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

    
    async getSensorLastData(dispositiveID: number, sensorID: number) {
        return await this.aggregate('Dispositives', this.getSensorLastDataAgg(dispositiveID,sensorID))
    }

    public getSensorLastDataAgg(dispositiveID: number, sensorID: number){
        return [
            { '$match': { 'DispositiveID': dispositiveID } },
            { 
              '$project': {
                'Sensors': {
                  '$filter': {
                    'input': '$Sensors',
                    'as': 'sensor',
                    'cond': { '$eq': ['$$sensor.sensorID', sensorID] }
                  }
                },
                'DispositiveID': 1,
                'userID': 1
              }
            },
            { 
              '$project': {
                'sensor': { 
                  '$arrayElemAt': ['$Sensors', 0]
                },
                'DispositiveID': 1,
                'userID': 1
              }
            },
            { 
              '$project': {
                'sensor': {
                  'data': {
                    '$slice': [
                      { 
                        '$filter': {
                          'input': '$sensor.data',
                          'as': 'data',
                          'cond': {}
                        }
                      },
                      -1
                    ]
                  },
                  'unit': '$sensor.unit',
                  'sensorID': '$sensor.sensorID'
                },
                'DispositiveID': 1,
                'userID': 1
              }
            },
            { 
              '$project': {
                'value': { '$arrayElemAt': ['$sensor.data.value', 0] },
                'unit': '$sensor.unit',
                'sensorID': '$sensor.sensorID',
                'dispositiveID': '$DispositiveID',
                'timestamp': { '$arrayElemAt': ['$sensor.data.timestamp', 0] },
                'userID': '$userID'
              }
            }
          ]
    }
    
  async WatchLastData(dispositiveID: number, sensorID: number) {

    const col = await this.getCollection("Dispositives")
    this.lastData = await col.watch([
        { '$match': { 'DispositiveID': dispositiveID } }
      ])

    this.lastData.on('resumeTokenChanged', (next) => {
        console.log('Change detected:', next);
        // Process the change (you can add more processing logic here)
        this.lastData = next;
      });
  
      this.lastData.on('error', (error) => {
        console.error('Error in change stream:', error);
      });
  
      this.lastData.on('end', () => {
        console.log('Change stream closed');
      });
  }
 
  async CloseLastData() {
    if (this.lastData) {
      await this.lastData.close()
    }
  }
}

export default new MongoService()