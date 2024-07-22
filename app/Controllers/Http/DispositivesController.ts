import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dispositive from 'App/Models/Dispositive'
import CreateDispositiveValidator from 'App/Validators/CreateDispositiveValidator'

export default class DispositivesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, auth, response }: HttpContextContract) {
    try {
      await auth.authenticate()
    } catch (error) {
      return response.status(401).json({ message: 'You are not logged in' })
    }

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
    return response.status(201).json(dispositive)
  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
