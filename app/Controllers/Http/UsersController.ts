import Mail from '@ioc:Adonis/Addons/Mail'
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Env from '@ioc:Adonis/Core/Env'
import Database from '@ioc:Adonis/Lucid/Database';


export default class UsersController {
  /**
   * @swagger
   * /api/users:
   *  get:
   *    tags:
   *      - Usuarios
   *    summary: Lista de usuarios
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        description: Success!!
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                  description: Tipo de respuesta
   *                title:
   *                  type: string
   *                  description: Titulo de la respuesta
   *                messgae:
   *                  type: string
   *                  description: Mensaje de la respuesta
   *                data:
   *                  type: string 
   *                  description: Datos de la respuesta
   */
  public async index({ response }: HttpContextContract) {

    const users = await User.query().preload('dispositivo', (habitUser) => {
      habitUser.preload('sensores')
    })
    return response.status(200).send({
      type: 'Success!!',
      title: 'Acceso a lista de usuarios',
      message: 'Lista de usuarios',
      data: users
    })
  }

  /**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Usuarios
 *    summary: Lista de usuarios
 *    produces:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        description: ID del usuario a mostrar.
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Usuario especifico obtenido correctamente
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                type:
 *                  type: string
 *                  description: Tipo de respuesta
 *                title:
 *                  type: string
 *                  description: Titulo de la respuesta
 *                message:
 *                  type: string
 *                  description: Mensaje de la respuesta
 *                data:
 *                  type: string 
 *                  description: Datos de la respuesta
 */
  public async show({ response, params }: HttpContextContract) {
    const users = await User.query().where('id', params.id).preload('dispositivo', (dispositivo) => {
      dispositivo.preload('sensores', (sensor) => {
        sensor.preload('sensorType')
      }).preload('tipoDispositivo')
    }).preload('configurations').first()
    if (!users) {
      return response.status(404).send({
        type: 'Error',
        title: 'Error al obtener usuario por identificador',
        message: 'No se encontro usuario con este identificador'
      })
    }
    try {
      return response.status(200).send({
        type: 'Success!!',
        title: 'Mostrar usuario y dispositivo',
        message: 'Usuario',
        data: users
      })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.status(404).send({
          type: 'Error',
          title: 'Error al obtener usuario por identificador',
          message: 'No se encontro usuario con este identificador',
          error: error
        })
      }
    }

  }

  public async SendCodigo({ response, params }: HttpContextContract) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const user = await User.findOrFail(params.id);
    const codigo = this.generateVerificationCode()
    const email = user.email

    await Mail.send((message) => {
      message
        .from(Env.get('SMTP_USERNAME'), 'Healthy App')
        .to(email)
        .subject('Healthy App - Codigo de verifiacion')
        .htmlView('emails/VerificationCode', { codigo });
    });
    user.verificationCode = codigo
    await user.save()
    return response.status(200).send({
      type: 'Success!!',
      title: 'Codigo de verificacion enviado a tu correo electronico',
      message: 'Se mando codigo de verificacion a tu correo electronico'
    })
  }
  /**
   * @swagger
   * /api/users:
   *  post:
   *      tags:
   *        - Usuarios
   *      summary: Crear un nuevo usuario
   *      description: Crea un nuevo usuario con los datos proporcionados y envía un correo electrónico de verificación.
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              $ref: '#/components/schemas/UserInput'
   *            example:
   *              name: John
   *              lastname: Doe
   *              email: john.doe@example.com
   *              nickname: '@johndoe'
   *              password: password123
   *      responses:
   *        201:
   *          description: Usuario creado exitosamente. Se ha enviado un correo electrónico de verificación.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  type: 
   *                    type: string
   *                    description:  Tipo de respuesta
   *                  title:
   *                    type: string  
   *                    description:  Titulo de la respuesta
   *                  message: 
   *                    type: string
   *                    description:  Mesaje de la respuesta
   *                  data:
   *                    type: object
   *                    properties:
   *                      user_id:
   *                        type: number
   *                        description: ID del usuario creado.
   *                      name:
   *                        type: string
   *                        description: Nombre del usuario.
   *                      lastname:
   *                        type: string
   *                        description: Apellido del usuario.
   *                      email:
   *                        type: string
   *                        description: Correo electrónico del usuario.
   *        400:
   *          description: Error al crear el usuario. El correo electrónico proporcionado ya está registrado.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  type:
   *                    type: string
   *                    description: Tipo de respuesta
   *                  title:
   *                    type: string
   *                    description:  Titulo de la respuesta
   *                  message:
   *                    type: string
   *                    description: Mensaje de la respuesta
   *                  error:
   *                    type: string
   *                    description: Correo electrónico ya registrado
   *        500:
   *          description: Error interno del servidor al intentar crear el usuario.
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  type:
   *                    type: string
   *                    description : Tipo de respuesta
   *                  title:
   *                    type: string
   *                    description: Titulo de la respuesta
   *                  message:
   *                    type: string
   *                    example: Error al crear usuario
   *                  error:
   *                    type: string
   *                    example: Descripción del error interno
   *  components:
   *    schemas:
   *      UserInput:
   *        type: object
   *        properties:
   *          name:
   *            type: string
   *          lastname:
   *            type: string
   *          email:
   *            type: string
   *          password:
   *            type: string
   *        required:
   *          - name
   *          - lastname
   *          - email
   *          - password
   */

  public async register({ request, response }: HttpContextContract) {
    try {
      console.log('Iniciando registro');
      const validationSchema = schema.create({
        email: schema.string({}, [
          rules.email(),
          rules.unique({ table: 'users', column: 'email' }),
        ]),
        password: schema.string({}, [rules.minLength(8),]),
        nickname: schema.string({}, [
          rules.regex(/^@/),
          rules.unique({ table: 'users', column: 'nickname' }),
        ]),
        name: schema.string({}, [
          rules.maxLength(180),
          rules.regex(/^[a-zA-Z\s]+$/),
        ]),
        lastname: schema.string({}, [
          rules.maxLength(180),
          rules.regex(/^[a-zA-Z\s]+$/),
        ]),
      })

      const validatedData = await request.validate({
        schema: validationSchema,
      })

      console.log('Validación exitosa');

      const newUser = await User.create({
        name: validatedData.name,
        lastname: validatedData.lastname,
        email: validatedData.email,
        nickname: validatedData.nickname,
        password: await Hash.make(validatedData.password),
      })

      console.log('Usuario creado:', newUser.toJSON());

      const verificationCode = this.generateVerificationCode();
      newUser.verificationCode = verificationCode;

      await newUser.save();

      const emailData = { code: verificationCode };

      await Mail.send((message) => {
        message
          .from(Env.get('SMTP_USERNAME'), 'Healthy App')
          .to(newUser.email)
          .subject('Healthy App - Verificación de cuenta')
          .htmlView('emails/welcome', emailData);
      });
      console.log('Email enviado');

      // const accountSid = Env.get('TWILIO_ACCOUNT_SID')
      // const authToken = Env.get('TWILIO_AUTH_TOKEN')
      // const client = require('twilio')(accountSid, authToken)

      // await client.messages.create({
      //   body: "Gracias por registrarte en HealthyApp :D",
      //   from: Env.get('TWILIO_FROM_NUMBER'),
      //   to:`+52 8715889697`
      // })

      console.log('Preparando respuesta positiva');
      return response.status(201).json({
        type: 'Success!!',
        title: 'Registro correctamente',
        message: 'Usuario registrado correctamente, se ha enviado un código de verificación a tu email',
        data: { newUser }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      return response.status(400).json({
        type: 'Error',
        title: 'Error registrar usuario',
        message: 'Error al crear usuario',
        error: error.message,
      });
    }
  }

  // ! FUNC
  private generateVerificationCode() {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return randomNumber.toString();
  }

  /**
   * @swagger
   * /api/users/actualizar:
   *  put:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Usuarios
   *    summary: Actualización de datos de usuario
   *    description: Actualiza los datos de un usuario existente. Cada campo es opcional y se actualizará solo si está presente en la solicitud.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *              lastname:
   *                type: string
   *              email:
   *                type: string
   *    responses:
   *       200:
   *        description: Datos de usuario actualizados exitosamente.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                  description:  Tipo de respuesta
   *                title:
   *                  type: string
   *                  description:  Titulo de la respuesta
   *                message:
   *                  type: string
   *                  description:  Mensaje de la respuesta
   *                data:
   *                  type: string
   *                  description:  Datos de la respuesta
   *       401:
   *        description: Error interno del servidor al actualizar los datos del usuario.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type: 
   *                  type: string
   *                  description:  Tipo de respuesta
   *                title:
   *                  type: string
   *                  description:  Titulo de la respuesta
   *                message:
   *                  type: string
   *                  description: Mensaje indicando el error interno del servidor.
   *                error:
   *                  type: string
   *                  description:  Error
   */
  public async update({ auth, request, response }: HttpContextContract) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const user = await User.query().where('id', auth.user?.id).preload('dispositivo', (dispositivo) => {
        dispositivo.preload('sensores', (sensor) => {
          sensor.preload('sensorType')
        }).preload('tipoDispositivo')
      }).preload('configurations').first();

      if (!user) {
        return response.status(404).json({
          type: 'Error',
          title: 'Usuario no encontrado',
          message: 'Error al encontrar los datos del usuario',
          error: []
        })
      }

      const { name, lastname, email } = request.only(['name', 'lastname', 'email']);

      // Construye un objeto con los campos que se van a actualizar
      const updates: { [key: string]: any } = {};
      if (name !== undefined) {
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(name)) {
          return response.status(400).json({
            type: 'Error',
            title: 'Error de credenciales',
            message: 'Error al crear usuario',
            error: 'El nombre solo puede contener letras y espacios',
          });
        }
        updates.name = name;
      }

      if (lastname !== undefined) {
        const lastnameRegex = /^[A-Za-z\s]+$/;
        if (!lastnameRegex.test(lastname)) {
          return response.status(400).json({
            type: 'Error',
            title: 'Error de credenciales',
            message: 'Error al crear usuario',
            error: 'El apellido solo puede contener letras y espacios',
          });
        }
        updates.lastname = lastname;
      }

      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return response.status(400).json({
            type: 'Error',
            title: 'Error de credenciales',
            message: 'Error al crear usuario',
            error: 'Formato de correo electrónico inválido',
          });
        }
        updates.email = email;
      }

      // Actualiza los datos del usuario en la base de datos directamente
      await Database.from('users').where('id', user.id).update(updates);

      // Obtiene los datos actualizados del usuario
      const updatedUser = await Database.from('users').where('id', user.id).first();

      // Envía el correo electrónico
      await Mail.send((message) => {
        message
          .from(Env.get('SMTP_USERNAME'), 'Healthy App')
          .to(user.email)
          .subject('Healthy App - Personalizacion de cuenta')
          .htmlView('emails/actualizarUser', { name: updates.name || user.name, lastname: updates.lastname || user.lastname, email: updates.email || user.email });
      });

      return response.status(200).json({
        type: 'Success!!',
        title: 'Datos actualizados',
        message: 'Datos de usuario actualizados',
        data: updatedUser
      });
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Error de servidor',
        message: 'Error interno del servidor al actualizar los datos del usuario',
        error: error.message
      });
    }
  }
  /**
  * @swagger
  * /api/users/update-password:
  *   put:
  *     security:
  *       - bearerAuth: []
  *     tags:
  *       - Usuarios
  *     summary: Actualización de contraseña de usuario
  *     description: Actualiza la contraseña de un usuario autenticado.
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               oldPassword:
  *                 type: string
  *               newPassword:
  *                 type: string
  *     responses:
  *       200:
  *         description: Contraseña de usuario actualizada exitosamente.
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
  *                   description: Titulo de la respuesta
  *                 message:
  *                   type: string
  *                   description: Mensaje indicando el éxito de la actualización de contraseña.
  *                 data:
  *                   type: string
  *                   description: Datos de la respuesta
  *       400:
  *         description: Error de solicitud debido a datos faltantes o inválidos.
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
  *                   description: Titulo de la respuesta
  *                 message:
  *                   type: string
  *                   description: Mensaje de la respuesta    
  *                 error:
  *                   type: string
  *                   description: Mensaje de error indicando el problema con la solicitud.
  *       401:
  *         description: No autorizado, token de acceso inválido o no proporcionado.
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
  *                   description: Titulo de la respuesta
  *                 message:
  *                   type: string
  *                   description: Mensaje de la respuesta
  *                 error:
  *                   type: string
  *                   description: Mensaje de error indicando la falta de autorización.
  *       500:
  *         description: Error interno del servidor al actualizar la contraseña del usuario.
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
  *                   description: Titulo de la respuesta
  *                 message:
  *                   type: string
  *                   description: Mensaje de la respuesta 
  *                 error:
  *                   type: string
  *                   description: Mensaje de error indicando el problema interno del servidor.
  */
  public async updatePassword({ auth, request, response }: HttpContextContract) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
    const userId = auth.user?.id;
  
    if (!userId) {
      return response.status(401).json({ error: 'Usuario no autenticado' });
    }
  
    try {
      const user = await User.findOrFail(userId);
  
      const { oldPassword, newPassword } = request.only(['oldPassword', 'newPassword']);
  
      const isPasswordValid = await Hash.verify(user.password, oldPassword);
      if (!isPasswordValid) {
        return response.status(401).json({ error: 'La contraseña anterior es incorrecta' });
      }
  
      if (newPassword.length < 8) {
        return response.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' });
      }
  
      user.password = await Hash.make(newPassword);
      await user.save();
  
      await Mail.send((message) => {
        message
          .from(Env.get('SMTP_USERNAME'), 'Healthy App')
          .to(user.email)
          .subject('Healthy App - Recuperacion de Contraseña')
          .htmlView('emails/nuevaContrasena', { email: user.email });
      });
  
      return response.status(200).json({
        type: 'Exitoso!!',
        title: 'Contraseña actualizada',
        message: 'Contraseña de usuario actualizada',
        data: user
      });
    } catch (error) {
      return response.status(error.status || 500).json({
        type: 'Error',
        title: 'Error al actualizar contraseña',
        message: error.message || 'Error interno del servidor al actualizar la contraseña del usuario'
      });
    }
  }

  public async destroy({ response, auth }: HttpContextContract) {
    try {
      const usuario = auth.user!
      await usuario.delete()
      return response.status(204).send({
        type: 'Exitoso!!',
        title: 'Exito al eliminar usuario',
        message: 'Usuario eliminado exitosamente',
        data: usuario
      })

    } catch (error) {
      return response.status(400).send({
        type: 'Error',
        title: 'Error al aliminar usuario',
        message: 'Se produjo un error al eliminar usuario'
      })
    }
  }
  /**
   * @swagger
   * /api/users/auth-login:
   *  post:
   *    tags:
   *      - Usuarios
   *    summary: Verificar sesión de usuario.
   *    description: Inicia sesión de usuario verificando el correo electrónico y el código de verificación.
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              user_email:
   *                type: string
   *                format: email
   *              password:
   *                type: string
   *              verification_code:
   *                type: string
   *            required:
   *              - user_email
   *              - password
   *              - verification_code
   *    responses:
   *      200:
   *        description: Inicio de sesión exitoso.
   *        content:
   *          application/json:
   *            example:
   *              type: Tipo de respuesta
   *              title: Titulo de la respuesta
   *              message: Inicio de sesión exitoso
   *              data: Datos de la respuesta
   *      401:
   *        description: Datos inválidos o usuario no verificado.
   *        content:
   *          application/json:
   *            example:
   *              type: Warning
   *              title: Datos inválidos
   *              message: Usuario no verificado o datos incorrectos
   *              error: Datos incorrectos 
   *      400:
   *        description: Error al iniciar sesión.
   *        content:
   *          application/json:
   *            example:
   *              type: Tipo de respuesta
   *              title: Titulo de la respuesta
   *              message: Error al iniciar sesión
   *              error: Descripción del error
   */
  public async authLogin({ request, response }: HttpContextContract) {
    try {
      const user_email = request.input('user_email');
      const password = request.input('password');
      const verificationCode = request.input('verification_code');

      const user = await User.query()
        .where('email', user_email)
        .where('verification_code', verificationCode)
        .first();

      if (!user || user.verificationCode !== verificationCode) {
        // Devolver error de datos inválidos
        return response.status(401).send({
          type: 'warning',
          title: 'Datos inválidos',
          message: 'Usuario no verificado o datos incorrectos',
        });
      }

      if (!(await Hash.verify(user.password, password))) {
        return response.status(401).send({
          type: 'warning',
          title: 'Datos inválidos',
          message: 'Contraseña incorrecta',
        });
      }

      user.verificationCode = null;
      await user.save();

      return response.status(200).json({
        type: 'Exitoso!!',
        title: 'Verificado',
        message: 'Cuenta Verificada Correctamente'
      });
    } catch (error) {
      return response.status(400).json({
        type: 'Error',
        title: 'Error de inicio',
        message: 'Error al iniciar sesión',
        error: error.message,
      });
    }
  }
  /**
   * @swagger
   * /api/users/logout:
   *  post:
   *    security:
   *      - bearerAuth: []
   *    tags:
   *      - Usuarios
   *    summary: Cierre de sesión de usuario
   *    description: Cierra la sesión actual del usuario.
   *    responses:
   *       200:
   *        description: Sesión cerrada exitosamente.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                  description: Tipo de respuesta
   *                title:
   *                  type: string
   *                  description:  Titulo de la respuesta
   *                message:
   *                  type: string
   *                  description: Mensaje indicando el éxito del cierre de sesión.
   *                data:
   *                  type: string
   *                  description: Datos de la respuesta
   */
  public async logout({ auth, response }: HttpContextContract) {
    try {
      await auth.logout()
      return response.status(200).send({
        type: 'Exitoso!!',
        title: 'Logout exitoso',
        message: 'Logout exitosamente '
      })

    } catch (error) {
      return response.status(200).send({
        type: 'Error',
        title: 'Error al cerrar sesion',
        message: 'Se produjo un error al cerrar sesion'
      })

    }
  }
  /**
   * @swagger
   * /api/users/login:
   *  post:
   *    tags:
   *      - Usuarios
   *    summary: Iniciar sesión de usuario
   *    requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              email:
   *                type: string
   *                description: Correo electrónico del usuario
   *              password:
   *                type: string
   *                description: Contraseña del usuario
   *    responses:
   *      200:
   *        description: Inicio de sesión exitoso
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                  description: Tipo de respuesta
   *                title:
   *                  type: string
   *                  description: Titulo de la respuesta
   *                message:
   *                  type:
   *                  description: Mensaje de la respuesta
   *                token:
   *                  type: string
   *                  description: Token de autenticación generado
   *      401:
   *        description: Credenciales inválidas
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                  description: Tipo de respuesta
   *                title:
   *                  type: string
   *                  description: Titulo de la respuesta
   *                message:
   *                  type: string
   *                  example: Usuario no encontrado
   *                error:
   *                  type: string
   *                  example: Error usuario no encontrado
   *      500:
   *        description: Error interno del servidor
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                type:
   *                  type: string
   *                  description: Tipo de respuesta
   *                title: 
   *                  type: string
   *                  description: Titulo de la respuesta
   *                message:
   *                  type: string
   *                  example: Error al iniciar sesión
   *                error:
   *                  type: string
   */
  public async login({ request, auth, response }: HttpContextContract) {
    try {
      const email = request.input('email');
      const password = request.input('password');

      // Verificar las credenciales del usuario
      const user = await User.query().where('email', email).preload('dispositivo', (dispositivo) => {
        dispositivo.preload('sensores', (sensor) => {
          sensor.preload('sensorType')
        }).preload('tipoDispositivo')
      }).preload('configurations').first()

      if (!user) {
        return response.status(401).json({ message: 'Usuario no encontrado' });
      }

      const isPasswordValid = await Hash.verify(user.password, password);

      if (!isPasswordValid) {
        return response.status(401).json({ message: 'Contraseña incorrecta' });
      }
      // Verificar si el usuario ya está verificado con su código
      if (user.emailVerifiedAt == null) {
        return response.status(401).json({
          type: 'Error',
          title: 'Error al iniciar sesion',
          message: 'El usuario aún no está verificado. Por favor, verifique su cuenta.'
        });
      }

      const token = await auth.use('api').generate(user, { expiresIn: '3 days' });

      return response.status(200).json({
        type: 'Exitoso!!',
        title: 'Login exitoso',
        message: 'Login exitosamente',
        data: {
          token,
          user,
        },
      });
    } catch (error) {
      return response.status(500).json({
        type: 'Error',
        title: 'Error al iniciar sesion',
        message: 'Error al iniciar sesión', error: error.message
      });
    }
  }
  /**
   * @swagger
   * /api/users/recuperar-contra:
   *   post:
   *     tags:
   *       - Usuarios
   *     summary: Solicitar recuperación de contraseña
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Correo electrónico del administrador para recuperar la contraseña
   *     responses:
   *       200:
   *         description: Correo electrónico enviado con éxito
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
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   example: Se ha enviado un correo electrónico con un código de recuperación.
   *                 data:
   *                   type: string
   *                   example: Codigo de verificacion
   *       400:
   *         description: Correo electrónico no encontrado
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
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   example: No se encontró un administrador con este correo electrónico.
   *                 error:
   *                   type: string
   *                   example: Administrador no encontrado
   *       500:
   *         description: Error del servidor
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
   *                   description: Titulo de la respuesta
   *                 message:
   *                   type: string
   *                   example: Error al enviar el correo electrónico de recuperación.
   *                 error:
   *                   type: string
   *                   example: Mensaje de error detallado
   */
  public async correorecuperacion({ request, response }: HttpContextContract) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    try {
      const email = request.input('email')
      const user = await User.query().where('email', email).preload('dispositivo', (dispositivo) => {
        dispositivo.preload('sensores', (sensor) => {
          sensor.preload('sensorType')
        }).preload('tipoDispositivo')
      }).preload('configurations').first()

      if (!user) {
        return response.status(400).json({
          message: 'No se encontró un usuario con este correo electrónico.',
        })
      }

      const verificationCode = this.generateVerificationCode()

      user.verificationCode = verificationCode
      await user.save()

      await Mail.send((message) => {
        message
          .from(Env.get('SMTP_USERNAME'), 'Healthy App')
          .to(email)
          .subject('Recuperación de Contraseña')
          .htmlView('emails/recuperacion', { verificationCode })
      })

      return response.status(200).json({
        message: 'Se ha enviado un correo electrónico con un código de recuperación.',
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error al enviar el correo electrónico de recuperación.',
        error: error.message,
      })
    }
  }

  /**
* @swagger
* /api/users/RecuperarPassword:
*   post:
*     tags:
*       - Usuarios
*     summary: Recuperar la contraseña del usuario utilizando un código de recuperación
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             required:
*               - email
*               - verificationCode
*               - newPassword
*             properties:
*               email:
*                 type: string
*                 format: email
*               verificationCode:
*                 type: string
*               newPassword:
*                 type: string
*                 format: password
*     responses:
*       200:
*         description: Contraseña actualizada exitosamente
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Contraseña actualizada exitosamente.
*       400:
*         description: Código de recuperación no válido
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: El código de recuperación no es válido.
*       404:
*         description: Administrador no encontrado
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: No se encontró un administrador con este correo electrónico.
*       500:
*         description: Error del servidor
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Error al actualizar la contraseña.
*                 error:
*                   type: string
*                   example: Mensaje de error detallado
*/
  public async RecuperarPassword({ request, response }: HttpContextContract) {
    try {
      const { email, verificationCode, newPassword } = request.only(['email', 'verificationCode', 'newPassword'])
      const user = await User.findByOrFail('email', email)

      if (user.verificationCode !== verificationCode || !user.verificationCode) {
        return response.status(400).json({
          message: 'El código de recuperación no es válido.',
        });
      }
      user.password = await Hash.make(newPassword)
      user.verificationCode = null
      await user.save()

      return response.status(200).json({
        "type": "Exitoso",
        "title": "Recursos encontrados",
        "message": "La Contrasena fue actualizada con exito",
      })
    } catch (error) {
      return response.internalServerError({
        "type": "Error",
        "title": "Error de sevidor",
        "message": "Hubo un fallo en el servidor durante el registro de los datos",
        "errors": error.message
      })
    }
  }
}