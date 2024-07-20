import Env from '@ioc:Adonis/Core/Env'
import { MongoClient } from "mongodb";

let dbInstance : any = null

async function connect() {
    if (!dbInstance) {
        const client = new MongoClient(Env.get('MONGODB_URI'))
        await client.connect()
        dbInstance = client.db(Env.get('MONGO_DB_NAME'))
    }
    return dbInstance
}

export default connect
