import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SensorType from 'App/Models/SensorType'

export default class SensorTypesController {

/**
 * @swagger
 * /api/sensor-type:
 *   get:
 *     summary: Obtiene una lista de tipos de sensores
 *     tags:
 *       - SensorTipo
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ¡Éxito!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: array
 *                   description: Lista de tipos de sensores
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del tipo de sensor
 *                       name:
 *                         type: string
 *                         description: Nombre del tipo de sensor
 *                       description:
 *                         type: string
 *                         description: Descripción del tipo de sensor
 */
public async index({ response }: HttpContextContract) {
   try{
    const SensorTypes = await SensorType.all()
    return response.status(200).send({
      type: 'Exitoso!!',
      title: 'Recurso de Sensortype obtenido con exito',
      message: 'Tipos de sensores obtenidos exitosamente',
      data: SensorTypes
    });
  }catch(error){
    return response.status(500).send({
      type: 'Error',
      titlte: 'Error al obtener tipos de sensores',
      message: 'Se produjo un error al obtener los tipo de sensores',
      error: error.message,
    });
  }
}
/**
 * @swagger
 * /api/sensor-type:
 *   post:
 *     summary: Crea un nuevo tipo de sensor
 *     tags:
 *       - SensorTipo
 *     security:
 *       - bearerAuth: []
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del tipo de sensor
 *               unit:
 *                 type: string
 *                 description: Unidad de medida del sensor
 *     responses:
 *       200:
 *         description: ¡Éxito!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type: string
 *                 title: Respuesta exitosa
 *                 message: Mensaje de éxito
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del tipo de sensor creado
 *                     name:
 *                       type: string
 *                       description: Nombre del tipo de sensor
 *                     unit:
 *                       type: string
 *                       description: Unidad de medida del sensor
 */
  public async store({response, request}: HttpContextContract) {
    const {name, unit} = request.body()
    const newSensorType = new SensorType()
    newSensorType.name = name
    newSensorType.unit = unit
    await newSensorType.save()
    return response.status(200).send({
      type: 'Exitoso!!',
      title:'Exito al crear un tipo de sensor',
      message:'Exito al crear un tipo de sensor',
      data:newSensorType
    })
  }
/**
 * @swagger
 * /api/sensor-type/{id}:
 *   put:
 *     summary: Actualiza un tipo de sensor existente
 *     tags:
 *       - SensorTipo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del tipo de sensor que se va a actualizar
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del tipo de sensor
 *               unit:
 *                 type: string
 *                 description: Unidad de medida del sensor
 *     responses:
 *       200:
 *         description: ¡Éxito!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del tipo de sensor actualizado
 *                     name:
 *                       type: string
 *                       description: Nombre del tipo de sensor actualizado
 *                     unit:
 *                       type: string
 *                       description: Unidad de medida del sensor actualizado
 */
  public async update({request, params, response}: HttpContextContract) {
    try {
      const {name, unit} = request.body()
      const upSensorType = await SensorType.findOrFail(params.id)
      upSensorType.name = name
      upSensorType.unit = unit
      await upSensorType.save()
      return response.status(200).send({
        type: 'Exitoso!!',
        title:'Exito al actualizar tipo de sensor',
        message:'Tipo de sensor actualizado',
        data:upSensorType 
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          type: 'Error',
          title: 'Error al obtener tipo de sensor',
          message:'Tipo de sensor no encontrado, intenta otro identificador :/'
        })
      }
    }
  }
/**
 * @swagger
 * /api/sensor-type/{id}:
 *   delete:
 *     summary: Elimina un tipo de sensor por su ID
 *     tags:
 *       - SensorTipo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del tipo de sensor que se va a eliminar
 *         schema:
 *           type: integer
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ¡Éxito!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título de la respuesta
 *                 message:
 *                   type: string
 *                   description: Mensaje de la respuesta
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID del tipo de sensor eliminado
 *                     name:
 *                       type: string
 *                       description: Nombre del tipo de sensor eliminado
 *                     unit:
 *                       type: string
 *                       description: Unidad de medida del sensor eliminado
 *       404:
 *         description: Tipo de sensor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: Tipo de respuesta
 *                 title:
 *                   type: string
 *                   description: Título del error
 *                 message:
 *                   type: string
 *                   description: Mensaje del error
 */
  public async destroy({params, response}: HttpContextContract) {
    try {
      const delSensorType = await SensorType.findOrFail(params.id)
      await delSensorType.delete()
      return response.status(200).send({
        type: 'Exitoso!!',
        title:'Se elimino el tipo de sensor',
        message:'Tipo de sensor eliminado exitosamente D:',
        data:delSensorType
      })
    } catch (error) {
      if(error.code === 'E_ROW_NOT_FOUND'){
        return response.status(404).send({
          type: 'Error',
          title:'Error al eliminar tipo de sensor',
          message:'Tipo de sensor no encontrado, intenta con otro identificador :/'
        })
      }
    }
  }
}
