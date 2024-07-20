import connect from "Config/mongo";

class MongoService {
    private db: any

    constructor() {
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

    private async getCollection(collectionName: string) {
        await this.ensureInit();
        if (!this.db) {
            throw new Error('Failed to connect to the database.');
        }
        return this.db.collection(collectionName)
    }

    public async aggregate(collectionName: string, pipeline: any[]) {
        const collection = await this.getCollection(collectionName)
        return await collection.aggregate(pipeline).toArray()
    }

    async getSensorLastData(dispositiveID: number, sensorID: number) {
        const agg = [
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
              'userID': '$userID'
            }
          }
        ]
        return await this.aggregate('Dispositives', agg)
    }
}

export default new MongoService()