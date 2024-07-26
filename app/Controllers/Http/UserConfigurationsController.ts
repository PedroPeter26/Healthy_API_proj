import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserConfiguration from 'App/Models/UserConfiguration'

export default class UserConfigurationsController {
  

  public async update({ params, request, auth, response }: HttpContextContract) {
    const user = auth.user
    if (!user) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

    const { data } = request.only(['data'])

    const userConfiguration = await UserConfiguration.query()
      .where('user_id', user.id)
      .where('id', params.id)
      .first()

    if (!userConfiguration) {
      return response.status(404).json({ message: 'User configuration not found' })
    }

    userConfiguration.data = data
    await userConfiguration.save()

    return response.status(200).json(userConfiguration)
  }
}
