import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MongoService from 'App/Services/MongoService'
import Sensor from 'App/Models/Sensor'
import SensorType from 'App/Models/SensorType'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import DispositiveType from 'App/Models/DispositiveType'
import { DateTime } from 'luxon'

export default class SensorsController {
  public async index({ }: HttpContextContract) { }

  public async show({ }: HttpContextContract) { }

  public async getSensorTypes({ params, response }: HttpContextContract) {
    const dispositiveTypeName = params.type
  
    const dispositiveType = await DispositiveType.query().where('name', dispositiveTypeName).first()
    
    if (!dispositiveType) {
        return response.status(404).json({ message: 'Dispositive type not found' })
    }

    let sensorTypeIds: number[] = []
    
    if (dispositiveType.id == 1) {
        sensorTypeIds = [1, 2, 3, 4, 5, 6]
    } else if (dispositiveType.id == 2) {
        sensorTypeIds = [7, 8]
    } else {
        sensorTypeIds = []
    }
    
    const sensorTypes = await SensorType.query().whereIn('id', sensorTypeIds)
  
    return response.status(200).json(sensorTypes)
}

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

      const sensorType = await SensorType.query().where('id', payload.sensorTypeId).firstOrFail()

      // Documento para el sensor en MongoDB
      const sensorDocument = {
        sensorID: sensor.id,
        sensorType: sensorType.name,
        unit: sensorType.unit,
        data: []
      }

      // Actualizar el documento en MongoDB
      const result = await MongoService.updateOneSensor(
        'Dispositives',
        { DispositiveID: payload.dispositiveID },
        { $push: { Sensors: sensorDocument } })
      if (result.modifiedCount === 0) {
        return response.status(404).json({ message: 'Dispositive not found or sensor not added' })
      }

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

  public async update({ }: HttpContextContract) { }

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

      const mongoResult = await MongoService.removeSensor(dispositiveID, sensorID)
      if (mongoResult.modifiedCount === 0) {
        return response.status(404).json({ message: 'Sensor not found or not removed in MongoDB' })
      }

      const sensor = await Sensor.query()
        .where('dispositiveId', dispositiveID)
        .andWhere('id', sensorID)
        .first()

      if (!sensor) {
        return response.status(404).json({ message: 'Sensor not found in relational database' })
      }

      await sensor.delete()

      return response.json({ message: 'Sensor removed successfully from both databases' })
    } catch (error) {
      console.error('Error removing sensor:', error)
      return response.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // * POST /sensors/sensor-list
  public async getSensorsList({ request, response }: HttpContextContract) {
    try {
      const { dispositiveID } = request.only(['dispositiveID']);
      const dispositiveIDNumber = Number(dispositiveID);
      if (isNaN(dispositiveIDNumber)) {
        return response.status(400).json({ message: 'Invalid DispositiveID' });
      }
      const sensorDoc = await MongoService.findOne('Dispositives', { DispositiveID: dispositiveIDNumber });

      if (!sensorDoc) {
        return response.status(404).json({ message: 'Dispositive not found' });
      }

      const sensorTypes = sensorDoc.Sensors.map((sensor: any) => ({
        id: sensor.sensorID,
        type: sensor.sensorType
      }));

      return response.json(sensorTypes);
    } catch (error) {
      console.error('Error fetching sensor types:', error);
      return response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // * POST /sensors/report-by-sensor
  public async reportBySensor({ request, response }: HttpContextContract) {
    const reportSchema = schema.create({
      dateBegin: schema.string({ trim: true }, [rules.required()]),
      dateFinish: schema.string({ trim: true }, [rules.required()]),
      sensorID: schema.number([rules.required()]),
      dispositiveID: schema.number([rules.required()])
    });
  
    try {
      const { dateBegin, dateFinish, sensorID, dispositiveID } = await request.validate({ schema: reportSchema });
  
      // Función para convertir fecha en formato ISO o personalizado
      const parseDate = (date: string) => {
        let dt = DateTime.fromISO(date.trim());
        if (!dt.isValid) {
          dt = DateTime.fromFormat(date.trim(), 'yyyy-MM-dd HH:mm:ss');
        }
        return dt;
      };
  
      const cleanedDateBegin = parseDate(dateBegin);
      const cleanedDateFinish = parseDate(dateFinish);
  
      if (!cleanedDateBegin.isValid || !cleanedDateFinish.isValid) {
        return response.status(400).json({ message: 'Invalid date format. Expected ISO or yyyy-MM-dd HH:mm:ss format' });
      }
  
      // Convertir las fechas a ISO string
      const isoDateBegin = cleanedDateBegin.toISO();
      const isoDateFinish = cleanedDateFinish.toISO();
  
      console.log('Request Params:', { isoDateBegin, isoDateFinish, sensorID, dispositiveID });
  
      const report = await MongoService.reportBySensor(isoDateBegin, isoDateFinish, sensorID, dispositiveID);
      
      if (!report || report.length === 0) {
        return response.status(404).json({ message: 'No data found for the given parameters' });
      }
  
      return response.status(200).json(report);
    } catch (error) {
      if (error.messages) {
        return response.status(422).json({ message: 'Validation error', details: error.messages });
      }
  
      console.error('Error generating report:', error);
      return response.status(500).json({ message: 'Internal Server Error' });
    }
  }

}
