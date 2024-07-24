// path: Validators/CreateUserValidator.ts
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateUserValidator {
  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [rules.minLength(8)]),
    nickname: schema.string({}, [rules.unique({ table: 'users', column: 'nickname' })]),
    name: schema.string({}, [rules.regex(/^[a-zA-Z\s]+$/)]),
    lastname: schema.string({}, [rules.regex(/^[a-zA-Z\s]+$/)]),
  })

  public messages = {
    'email.required': 'The email is required',
    'email.email': 'The email must be a valid email address',
    'email.unique': 'The email is already in use',
    'password.required': 'The password is required',
    'password.minLength': 'The password must be at least 8 characters long',
    'nickname.required': 'The nickname is required',
    'nickname.unique': 'The nickname is already in use',
    'name.required': 'The name is required',
    'name.regex': 'The name can only contain letters and spaces',
    'lastname.required': 'The lastname is required',
    'lastname.regex': 'The lastname can only contain letters and spaces',
  }
}
