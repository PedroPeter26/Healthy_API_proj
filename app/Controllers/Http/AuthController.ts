import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import Mail from '@ioc:Adonis/Addons/Mail'
import Env from '@ioc:Adonis/Core/Env'

export default class AuthController {

  // * POST
  public async register({ request, response }: HttpContextContract) {
    try {
      const validationSchema = schema.create({
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email' }),
        ]),
        password: schema.string({}, [rules.minLength(8),]),
        nickname: schema.string({}, [rules.unique({ table: 'users', column: 'nickname' }),]),
        name: schema.string({}, [rules.regex(/^[a-zA-Z\s]+$/),]),
        lastname: schema.string({}, [rules.regex(/^[a-zA-Z\s]+$/),]),
      })

      const validatedData = await request.validate({
        schema: validationSchema,
      })
      const role = await Role.findByOrFail('slug', 'common')
      const verificationCode = this.generateVerificationCode();
      
      const user = await User.create({
        name: validatedData.name,
        lastname: validatedData.lastname,
        email: validatedData.email,
        password: validatedData.password,
        nickname: validatedData.nickname,
        roleId: role.id,
        verificationCode: verificationCode
      })
      
      const emailData = { code: verificationCode };

      await Mail.send((message) => {
        message
          .from(Env.get('SMTP_USERNAME'), 'Healthy App')
          .to(user.email)
          .subject('Healthy App - Verificación de cuenta')
          .htmlView('Mails/welcome', emailData);
      });
      console.log('Email enviado');

      return response.status(201).json({
        type: 'Created',
        title: 'User created successfully',
        message: 'User account was created successfully. A verification code was sent to your email.',
        data: {user}
      })
    } catch (error) {
      return response.status(400).json({
        type: 'Error',
        title: 'Failed at register user',
        message: error.message
      })
    }
  }

  // @FUNC
  private generateVerificationCode() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return randomNumber.toString();
  }

  // * POST
  public async login({ request, auth, response }: HttpContextContract) {
    const {uid, password} = request.only(['uid', 'password'])

    try {
      const user = await User.query()
      .where('email', uid)
      .orWhere('nickname', uid)
      .firstOrFail()

      if (!user.active) {
        return response.status(401).json({
          type: 'Error',
          title: 'Unauthorized',
          message: 'Your account is not active. Please verify it.',
        })
      }

      const token = await auth.use('api').attempt(uid, password)
      return response.status(200).json({
        type: 'Success',
        title: 'Login successful',
        message: 'Session successfully started',
        token
      })
    } catch (error) {
      if (error.code === 'E_INVALID_AUTH_UID' || error.code === 'E_INVALID_AUTH_PASSWORD') {
        return response.status(400).json({
          type: 'Error',
          title: 'Invalid credentials',
          message: 'The provided credentials are incorrect.',
        })
      }
      //! Otro tipo de error
      return response.status(500).json({
        type: 'Error',
        title: 'Login failed',
        message: 'An unexpected error occurred. Please try again later.' + error.message,
      })
    }
  }

  // * POST
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()
      return response.status(200).json({
        type: 'Success',
        title: 'Logout successful',
        message: 'Logout successful and Token revoked'
      })
    } catch (error) {
      return response.status(400).json({
        type: 'Failure',
        title: 'Logout failed',
        message: error.message
      })
    }
  }

  // * POST
  public async verifyAccount({ request, response }: HttpContextContract) {
    const { email, verificationCode } = request.only(['email', 'verificationCode'])

    try {
      const user = await User.findByOrFail('email', email)

      if (user.verificationCode !== verificationCode) {
        return response.status(400).json({
          type: 'Error',
          title: 'Invalid verification code',
          message: 'The provided verification code is incorrect.',
        })
      }

      user.active = true
      user.verificationCode = null
      await user.save()

      return response.status(200).json({
        type: 'Success',
        title: 'Account verified',
        message: 'Your account has been successfully verified. You can now log in.',
      })
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Verification failed',
        message: 'An unexpected error occurred. Please try again later.' + error.message,
      })
    }
  }

  // * POST
  public async forgotMyPassword({ request, response }: HttpContextContract) {
    const email = request.input('email')

    const user = await User.findBy('email', email)
    if (!user) {
      return response.status(404).json({
        type: 'Error',
        title: 'User not found',
        message: "User's email doesn't match any existing user.",
      })
    }

    const verificationCode = this.generateVerificationCode()

    user.verificationCode = verificationCode
    await user.save()

    await Mail.send((message) => {
      message
        .to(user.email)
        .from(Env.get('SMTP_USERNAME'), 'Healthy App')
        .subject('Healthy App - Restablece tu contraseña')
        .htmlView('Mails/recuperacion', { verificationCode })
    })

    return response.status(200).json({
      type: 'Success',
      title: 'Verification code sent',
      message: 'CVerification code was sent to your email.',
    })
  }

  // * POST
  public async newPassword({ request, response }: HttpContextContract) {
    try {
      const { email, verificationCode, newPassword } = request.only(['email', 'verificationCode', 'newPassword'])
    const user = await User.findByOrFail('email', email)

    if (user.verificationCode!== verificationCode || !user.verificationCode) {
      return response.status(400).json({
        type: 'Error',
        title: 'Invalid verification code',
        message: 'El código de recuperación no es válido.',
      })
    }      
    user.password = newPassword;
    user.verificationCode = null;
    await user.save();

      return response.status(200).json({
        type: 'Success',
        title: 'Password updated',
        message: 'Your password has been successfully updated.',
      });
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Failed to update password',
        message: error.message,
      });
    }
  }

  //public async templateEndPoint({}: HttpContextContract) {}
}
