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

    // * Custom CRUD @Queries

    public async pushDataToSensor(dispositiveID: number, sensorID: number, Data: any) {
        const collection = await this.getCollection('Dispositives')
        return await collection.updateOne(
            { DispositiveID: dispositiveID, 'Sensors.sensorID': sensorID },
            { $push: { 'Sensors.$.data': Data } }
        )
    }

    // * General purpose Aggregation @Func

    public async aggregate(collectionName: string, pipeline: any[]) {
        const collection = await this.getCollection(collectionName)
        return await collection.aggregate(pipeline).toArray()
    }

    // * Custom Aggregations

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