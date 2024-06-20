import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TipoDispositivo from 'App/Models/TipoDispositivo'


export default class DeviceTypesController {
/**
 * @swagger
 * /api/tipo-dispositivo:
 *   get:
 *     summary: Obtiene la lista de tipos de dispositivos
 *     tags:
 *       - TiposDispositivos
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
 *                   type: array
 *                   description: Lista de tipos de dispositivos
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID del tipo de dispositivo
 *                       name:
 *                         type: string
 *                         description: Nombre del tipo de dispositivo
 */
  public async index({ response }: HttpContextContract) {
    const tiposDis = await TipoDispositivo.all()
    return response.status(200).send({
      type: 'Exitoso!!',
      title: 'Lista de tipos dispositivos',
      message: 'Lista de tipos dispositivos obtenido',
      data: tiposDis
    })
  }
}
