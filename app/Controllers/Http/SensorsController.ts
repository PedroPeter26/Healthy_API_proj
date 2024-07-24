import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MongoService from 'App/Services/MongoService'

export default class SensorsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

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

  // * DELETE /sensors/delete-dispositive
  public async delete({ request, response }: HttpContextContract) {
    try {
      const { dispositiveID } = request.only(['dispositiveID'])
      const result = await MongoService.deleteDispositive(dispositiveID)
      if (result.deletedCount === 0) {
        return response.status(404).json({ message: 'Document not found' })
      }
      return response.json({ message: 'Document deleted successfully' })
    } catch (error) {
      console.error('Error deleting document:', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // * DELETE /sensors/remove-sensor
  public async removeSensor({ request, response }: HttpContextContract) {
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

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
