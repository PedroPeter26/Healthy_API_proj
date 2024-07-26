import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'

export default class UsersController {

  // * GET /users
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all()
      return response.status(200).json({
        type: 'Success',
        title: 'Users fetched',
        data: users
      })
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Failed to fetch users',
        message: error.message
      })
    }
  }

  // * GET /users/:id
  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      return response.status(200).json({
        type: 'Success',
        title: 'User found',
        data: user
      })
    } catch (error) {
      return response.status(404).json({
        type: 'Error',
        title: 'User not found',
        message: 'The requested user does not exist.'
      })
    }
  }

  // * PUT /users/:id
  public async update({ params, request, auth, response }: HttpContextContract) {
    const authUser = auth.user!

    try {
      const { name, lastname, email, password, nickname } = request.only(['name', 'lastname', 'email', 'password', 'nickname'])
      const user = await User.findOrFail(params.id)

      if (user.id !== authUser.id) {
        return response.status(403).json({
          type: 'Error',
          title: 'Unauthorized',
          message: 'You are not authorized to update this user.'
        })
      }

      user.name = name ?? user.name
      user.lastname = lastname ?? user.lastname
      user.email = email ?? user.email
      user.nickname = nickname ?? user.nickname
      
      if (password) {
        user.password = password
      }

      await user.save()

      return response.status(200).json({
        type: 'Success',
        title: 'User updated',
        message: 'User information has been successfully updated.',
        data: user
      })
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Failed to update user',
        message: error.message
      })
    }
  }

  // * DELETE /users/:id
  public async destroy({ auth, params, response, request }: HttpContextContract) {
    const authUser = auth.user!
    const { password } = request.only(['password'])

    try {
      const user = await User.findOrFail(params.id)

      //? Verify if the authenticated user matches the user to be deleted
      if (user.id !== authUser.id) {
        return response.status(403).json({
          type: 'Error',
          title: 'Unauthorized',
          message: 'You are not authorized to delete this user.'
        })
      }

      const isPasswordValid = await Hash.verify(user.password, password)
      if (!isPasswordValid) {
        return response.status(401).json({
          type: 'Error',
          title: 'Unauthorized',
          message: 'Invalid password. Please provide the correct password to delete your account.'
        })
      }

      await user.delete()

      return response.status(200).json({
        type: 'Success',
        title: 'User deleted',
        message: 'Your account has been successfully deleted.'
      })
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Failed to delete user',
        message: error.message
      })
    }
  }
}
