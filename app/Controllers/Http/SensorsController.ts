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
      const { dispositiveID, sensorID } = request.only(['dispositiveID', 'sensorID']);
      const data = await MongoService.getSensorLastData(dispositiveID, sensorID);
      return response.json(data);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
