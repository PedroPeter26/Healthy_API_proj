import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserConfiguration from 'App/Models/UserConfiguration'
import MongoService from 'App/Services/MongoService'

export default class UserConfigurationsController {

  // * GET
  public async index({ request, response }: HttpContextContract) {
    const dispositiveId = request.input('dispositive_id')

    const userConfigurations = await UserConfiguration.query()
      .where('dispositive_id', dispositiveId)
      .preload('configurationOption') // Preload para incluir el campo name de configuration_options

    const result = userConfigurations.map(config => {
      return {
        id: config.id,
        userId: config.userId,
        dispositiveId: config.dispositiveId,
        configurationOptionsId: config.configurationOptionsId,
        data: config.data,
        configurationOptionName: config.configurationOption.name,
      }
    })

    return response.status(200).json(result)
  }

  // * PUT
  public async update({ request, auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

    // Obtener los datos del cuerpo de la solicitud
    const { data, dispositiveId, configurationOptionsId } = request.only(['data', 'dispositiveId', 'configurationOptionsId'])

    // Buscar la configuración del usuario en PostgreSQL
    const userConfiguration = await UserConfiguration.query()
      .where('user_id', user.id)
      .where('dispositiveId', dispositiveId)
      .where('configurationOptionsId', configurationOptionsId)
      .first()

    if (!userConfiguration) {
      return response.status(404).json({ message: 'User configuration not found' })
    }

    // Actualizar la configuración en PostgreSQL
    userConfiguration.data = data
    await userConfiguration.save()

    // Buscar la opción de configuración para obtener su acrónimo
    const configurationOption = await userConfiguration.related('configurationOption').query().firstOrFail()
    
    // Actualizar la configuración en MongoDB
    const updateResult = await MongoService.updateOneSensor(
      'Configurations',
      { id: dispositiveId, 'configurations.type': configurationOption.acronym },
      { $set: { 'configurations.$.value': data } }
    )

    if (updateResult.modifiedCount === 0) {
      return response.status(500).json({ message: 'Failed to update configuration in MongoDB' })
    }

    return response.status(200).json(userConfiguration)
  }
}
