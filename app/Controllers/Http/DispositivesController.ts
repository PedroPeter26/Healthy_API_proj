import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dispositive from 'App/Models/Dispositive'
import MongoService from 'App/Services/MongoService'
import AddSensorsValidator, { CreateDispositiveValidator, UpdateDispositiveValidator } from 'App/Validators/DispositiveValidator'
import Sensor from 'App/Models/Sensor'
import SensorType from 'App/Models/SensorType'
import DispositiveType from 'App/Models/DispositiveType'
AddSensorsValidator

export default class DispositivesController {
  public async types({ response }: HttpContextContract) {
    try {
      const types = await DispositiveType.all()
      return response.status(200).json(types)
    } catch (error) {
      return response.status(500).json({ message: 'Unable to fetch types' })
    }
  }

  public async index({ response }: HttpContextContract) {
    try {
      const dispositives = await Dispositive.all()
      return response.status(200).json(dispositives)
    } catch (error) {
      return response.status(500).json({ message: 'Unable to fetch dispositives' })
    }
  }

  public async show({ auth, response }: HttpContextContract) {
    const user = auth.user;
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' });
    }

    try {
      const dispositives = await MongoService.findMany('Dispositives', { userID: user.id });

      if (!dispositives.length) {
        return response.status(404).json({ message: 'No dispositives found for the user' });
      }

      for (const dispositive of dispositives) {
        for (const sensor of dispositive.Sensors) {
          const lastData = await MongoService.getSensorLastData(dispositive.DispositiveID, sensor.sensorID);

          if (lastData.length > 0) {
            sensor.data = lastData.map(item => ({
              value: item.value,
              timestamp: item.timestamp,
            }));
          } else {
            sensor.data = [];
          }
        }
      }

      return response.status(200).json(dispositives);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Unable to fetch dispositives for the user' });
    }
  }

  public async create({ request, auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

    const validatedData = await request.validate(CreateDispositiveValidator)

    const existingDispositive = await Dispositive.query().where('name', validatedData.name).first()
    if (existingDispositive) {
      return response.status(409).json({ message: 'Dispositive name already exists' })
    }

    const dispositive = new Dispositive()
    dispositive.name = validatedData.name
    dispositive.dispositiveTypeId = validatedData.dispositiveTypeId
    dispositive.userId = user.id

    await dispositive.save()

    // Crear documento en MongoDB
    const dispositiveType = await dispositive.related('dispositiveType').query().firstOrFail()
    const mongoDocument = {
      DispositiveID: dispositive.id,
      name: dispositive.name,
      type: dispositiveType.name,
      userID: dispositive.userId,
      Sensors: []
    }

    await MongoService.insertOneDevice('Dispositives', mongoDocument)

    await this.handleSensorsCreation(dispositive.id, dispositive.dispositiveTypeId,
      this.createSensors)

    return response.status(201).json(dispositive)
  }

  // * @Func auxiliar a @Create
  private async createSensors(dispositiveId: number, dispositiveTypeId: number) {
    const sensorTypes = {
      1: [1, 2, 3, 4, 5, 6],
      2: [7, 8]
    }

    const sensorTypeIds = sensorTypes[dispositiveTypeId] || []

    for (const sensorTypeId of sensorTypeIds) {
      const sensor = new Sensor()
      sensor.sensorTypeId = sensorTypeId
      sensor.dispositiveId = dispositiveId
      sensor.active = true

      await sensor.save()

      // Documento del sensor para MongoDB
      const sensorType = await SensorType.query().where('id', sensorTypeId).firstOrFail()
      const sensorDocument = {
        sensorID: sensor.id,
        sensorType: sensorType.name,
        unit: sensorType.unit,
        data: []
      }

      const result = MongoService.updateOneSensor('Dispositives',
        { DispositiveID: dispositiveId },
        { $push: { Sensors: sensorDocument } }
      )

      if (!result) {
        console.log('Sensor not added to MongoDB.')
      }
    }
  }

  // * @Func auxiliar a @Create
  private async handleSensorsCreation(dispositiveId: number, dispositiveTypeId: number,
    callback: (dispositiveId: number, dispositiveTypeId: number) => Promise<void>) {
    await callback(dispositiveId, dispositiveTypeId)
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

    const validatedData = await request.validate(UpdateDispositiveValidator)
    const { id } = validatedData

    try {
      const dispositive = await Dispositive.query().where('id', id).where('user_id', user.id).firstOrFail()

      dispositive.name = validatedData.name ?? dispositive.name
      dispositive.dispositiveTypeId = validatedData.dispositiveTypeId ?? dispositive.dispositiveTypeId

      await dispositive.save()
      return response.status(200).json(dispositive)
    } catch (error) {
      return response.status(404).json({ message: 'Dispositive not found or you do not have permission to update this dispositive' })
    }
  }

  public async destroy({ request, auth, response }: HttpContextContract) {
    const user = auth.user;
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' });
    }

    const { id } = request.only(['id']);

    try {
      const dispositive = await Dispositive.query().where('id', id).where('user_id', user.id).first();

      if (!dispositive) {
        return response.status(404).json({ message: 'Dispositive not found or you do not have permission to delete this dispositive' });
      }
      try {
        await this.deleteFromMongo(id);
      } catch (mongoError) {
        console.error('MongoDB deletion error:', mongoError.message);
        return response.status(500).json({ message: 'Error deleting document from MongoDB' });
      }
      await dispositive.delete();

      return response.status(200).json({ message: 'Dispositive deleted successfully' });
    } catch (error) {
      console.error('Error deleting dispositive:', error);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  // * @Func auxiliar para borrar dispositivo en MongoDB
  private async deleteFromMongo(dispositiveID: number) {
    try {
      const result = await MongoService.deleteDispositive(dispositiveID);
      if (result.deletedCount === 0) {
        throw new Error(`Document with DispositiveID ${dispositiveID} not found`);
      }
    } catch (error) {
      console.error('MongoDB deletion error:', error);
      throw new Error(`Error deleting document from MongoDB: ${error.message}`);
    }
  }

  public async addSensorsToDispositive({ request, auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }
  
    const validatedData = await request.validate(AddSensorsValidator)
    const dispositiveId = validatedData.dispositiveId
  
    const dispositive = await Dispositive.find(dispositiveId)
    if (!dispositive) {
      return response.status(404).json({ message: 'Dispositive not found' })
    }
  
    if (dispositive.userId !== user.id) {
      return response.status(403).json({ message: 'You do not have permission to add sensors to this dispositive' })
    }
  
    const sensorTypeIds = validatedData.sensorTypeIds
  
    for (const sensorTypeId of sensorTypeIds) {
      const sensor = new Sensor()
      sensor.sensorTypeId = sensorTypeId
      sensor.dispositiveId = dispositiveId
      sensor.active = true
  
      await sensor.save()
  
      const sensorType = await SensorType.query().where('id', sensorTypeId).firstOrFail()
      const sensorDocument = {
        sensorID: sensor.id,
        sensorType: sensorType.name,
        unit: sensorType.unit,
        data: []
      }
  
      const result = await MongoService.updateOneSensor(
        'Dispositives',
        { DispositiveID: dispositiveId },
        { $push: { Sensors: sensorDocument } }
      )
  
      if (!result) {
        console.log('Sensor not added to MongoDB.')
      }
    }
  
    return response.status(201).json({ message: 'Sensors added successfully' })
  }
}
