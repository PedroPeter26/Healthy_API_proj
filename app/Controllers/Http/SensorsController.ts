import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MongoService from 'App/Services/MongoService'
import Sensor from 'App/Models/Sensor'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class SensorsController {
  public async index({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  // * POST /api/sensors/store
  public async store({ request, response }: HttpContextContract) {
    const sensorSchema = schema.create({
      sensorTypeId: schema.number([
        rules.exists({ table: 'sensor_types', column: 'id' }),
      ]),
      dispositiveID: schema.number([
        rules.exists({ table: 'dispositives', column: 'id' }),
      ]),
      active: schema.boolean.optional(),
    })

    try {
      const payload = await request.validate({ schema: sensorSchema })

      const sensor = new Sensor()
      sensor.sensorTypeId = payload.sensorTypeId
      sensor.dispositiveId = payload.dispositiveID
      sensor.active = true

      await sensor.save()
      return response.status(201).json({
        type: 'Success',
        title: 'Sensor created!',
        message: 'Sensor created successfully',
        data: sensor
      })
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({
          type: 'Error',
          title: 'Validation error',
          message: error.messages
        })
      }

      console.error('Error creating sensor:', error)
      return response.status(500).json({
        type: 'Error',
        title: 'Internal Server Error',
        message: error.messages
      })
    }
  }

  // * POST /sensors/last-data
  public async getLastData({ request, response }: HttpContextContract) {
    try {
      const { dispositiveID, sensorID } = request.only(['dispositiveID', 'sensorID'])
      const data = await MongoService.getSensorLastData(dispositiveID, sensorID)
      return response.json(data)
    } catch (error) {
      console.error('Error fetching sensor data:', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // * POST /sensors/push-data
  public async pushData({ request, response }: HttpContextContract) {
    try {
      const { dispositiveID, sensorID, Data } = request.only(['dispositiveID', 'sensorID', 'Data'])
      const result = await MongoService.pushDataToSensor(dispositiveID, sensorID, Data)
      return response.json(result)
    } catch (error) {
      console.error('Error pushing sensor data:', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  public async update({}: HttpContextContract) {}

  // ! DELETE /sensors/delete-dispositive
  // ? Remove
  // public async delete({ request, response }: HttpContextContract) {
  //   try {
  //     const { dispositiveID } = request.only(['dispositiveID'])
  //     const result = await MongoService.deleteDispositive(dispositiveID)
  //     if (result.deletedCount === 0) {
  //       return response.status(404).json({ message: 'Document not found' })
  //     }
  //     return response.json({ message: 'Document deleted successfully' })
  //   } catch (error) {
  //     console.error('Error deleting document:', error)
  //     return response.status(500).json({ message: 'Internal Server Error' })
  //   }
  // }

  // * DELETE /sensors/remove-sensor
  public async destroy({ request, response }: HttpContextContract) {
    try {
      const { dispositiveID, sensorID } = request.only(['dispositiveID', 'sensorID'])
      const result = await MongoService.removeSensor(dispositiveID, sensorID)
      if (result.modifiedCount === 0) {
        return response.status(404).json({ message: 'Sensor not found or not removed' })
      }
      return response.json({ message: 'Sensor removed successfully' })
    } catch (error) {
      console.error('Error removing sensor:', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // * POST /sensors/sensor-list
  public async getSensorsList({ request, response }: HttpContextContract) {
    try {
      const { dispositiveID } = request.only(['dispositiveID'])

      // Fetch sensors and their types
      const sensors = await Sensor.query()
        .where('dispositive_id', dispositiveID)
        .preload('sensorType')

      // Map to the required format
      const result = sensors.map(sensor => ({
        id: sensor.id,
        type: sensor.sensorType.name
      }))

      return response.json(result)
    } catch (error) {
      console.error('Error fetching sensor types:', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

}
