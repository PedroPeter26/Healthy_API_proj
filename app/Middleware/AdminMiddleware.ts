import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminMiddleware {
  public async handle({ auth, response}: HttpContextContract, next: () => Promise<void>) {
    try {
      await auth.check()
    } catch {
      return response.unauthorized({ message: 'No tienes permiso para acceder a esta ruta' })
    }

    const user = auth.user

    if (!user) {
      return response.unauthorized({ message: 'No tienes permiso para acceder a esta ruta' })
    }

    await user.load('role')
    const isAdmin = user.role.slug === 'admin'

    if (!isAdmin) {
      return response.unauthorized({ message: 'No tienes permiso para acceder a esta ruta' })
    }

    await next()
  }
}
