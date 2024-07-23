import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dispositive from 'App/Models/Dispositive'
import { CreateDispositiveValidator, UpdateDispositiveValidator } from 'App/Validators/DispositiveValidator'

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
    return response.status(201).json(dispositive)
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
      return response.status(200).json({ message: 'Dispositive deleted successfully' })
    } catch (error) {
      return response.status(404).json({ message: 'Dispositive not found or you do not have permission to delete this dispositive' })
    }
  }
}
