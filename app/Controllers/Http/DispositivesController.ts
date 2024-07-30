import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dispositive from 'App/Models/Dispositive'
import MongoService from 'App/Services/MongoService'
import { CreateDispositiveValidator, UpdateDispositiveValidator } from 'App/Validators/DispositiveValidator'
import Sensor from 'App/Models/Sensor'
import SensorType from 'App/Models/SensorType'
import UserConfiguration from 'App/Models/UserConfiguration'
import ConfigurationOption from 'App/Models/ConfigurationOption'

export default class DispositivesController {
  public async index({ response }: HttpContextContract) {
    try {
      const dispositives = await Dispositive.all()
      return response.status(200).json(dispositives)
    } catch (error) {
      return response.status(500).json({ message: 'Unable to fetch dispositives' })
    }
  }

  public async show({ auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

    try {
      const dispositives = await Dispositive.query().where('user_id', user.id)
      return response.status(200).json(dispositives)
    } catch (error) {
      return response.status(500).json({ message: 'Unable to fetch dispositives for the user' })
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

    // Crear documento en MongoDB para la colección 'Configurations'
    const configMongoDocument = {
      id: dispositive.id,
      type: dispositiveType.acronym,
      sensors: [],
      configurations: []
    }

    await MongoService.insertOneDevice('Configurations', configMongoDocument)

    // Crear configuraciones predeterminadas en PostgreSQL y MongoDB
    await this.handleConfigurationsCreation(dispositive.id, dispositive.dispositiveTypeId, user.id)

    await this.handleSensorsCreation(dispositive.id, dispositive.dispositiveTypeId, this.createSensors)

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
        active: sensor.active,
        data: []
      }

      const result = await MongoService.updateOneSensor('Dispositives',
        { DispositiveID: dispositiveId },
        { $push: {Sensors: sensorDocument} }
      )

      if (!result) {
        console.log('Sensor not added to MongoDB.')
      }

      // Añadir sensor al documento de Configurations
      const sensorConfigDocument = {
        id: sensor.id,
        type: sensorType.acronym
      }

      await MongoService.updateOneSensor('Configurations',
        { id: dispositiveId },
        { $push: { sensors: sensorConfigDocument } }
      )
    }
  }

  // * @Func auxiliar a @Create
  private async handleSensorsCreation(dispositiveId: number, dispositiveTypeId: number,
    callback: (dispositiveId: number, dispositiveTypeId: number) => Promise<void>) {
    await callback(dispositiveId, dispositiveTypeId)
  }

  // * @Func auxiliar a @Create
  private async handleConfigurationsCreation(dispositiveId: number, dispositiveTypeId: number, userId: number) {
    const configurationDefaults = {
      1: [
        { configurationOptionsId: 1, data: '100.0' },
        { configurationOptionsId: 2, data: '500' },
        { configurationOptionsId: 3, data: '4' },
        { configurationOptionsId: 4, data: '100' }
      ]
    }

    const configurations = configurationDefaults[dispositiveTypeId] || []

    for (const config of configurations) {
      const userConfiguration = new UserConfiguration()
      userConfiguration.dispositiveId = dispositiveId
      userConfiguration.userId = userId
      userConfiguration.configurationOptionsId = config.configurationOptionsId
      userConfiguration.data = config.data

      await userConfiguration.save()

      const configurationOption = await ConfigurationOption.find(config.configurationOptionsId)
      const configurationDocument = {
        type: configurationOption?.acronym,
        value: config.data
      }

      const result = await MongoService.updateOneSensor('Configurations',
        { id: dispositiveId },
        { $push: { configurations: configurationDocument } }
      )
      console.log('Adding configuration to MongoDB:', configurationDocument)
      console.log('Result of MongoDB update:', result)

      if (!result) {
        console.log('Configuration not added to MongoDB.')
      }
    }
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
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

    const { id } = request.only(['id'])

    try {
      const dispositive = await Dispositive.query().where('id', id).where('user_id', user.id).firstOrFail()
      await dispositive.delete()

      try {
        await this.deleteFromMongo(id)
      } catch (mongoError) {
        console.error(mongoError.message)
      }

      return response.status(200).json({ message: 'Dispositive deleted successfully' })
    } catch (error) {
      return response.status(404).json({ message: 'Dispositive not found or you do not have permission to delete this dispositive' })
    }
  }

  // * @Func auxiliar para borrar dispositivo en MongoDB
  private async deleteFromMongo(dispositiveID: number) {
    try {
      const result = await MongoService.deleteDispositive(dispositiveID)
      if (result.deletedCount === 0) {
        throw new Error('Document not found')
      }
    } catch (error) {
      throw new Error('Error deleting document from MongoDB')
    }
  }
  
}
