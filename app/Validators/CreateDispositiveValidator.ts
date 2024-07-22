import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateDispositiveValidator {
  public schema = schema.create({
    name: schema.string({ trim: true }, [
      rules.required(),
      rules.maxLength(255)
    ]),
    dispositiveTypeId: schema.number([
      rules.required(),
      rules.unsigned()
    ])
  })

  public messages = {
    'name.required': 'The name is required',
    'name.maxLength': 'The name cannot be longer than 255 characters',
    'dispositiveType.required': 'The dispositive type is required',
    'dispositiveType.unsigned': 'The dispositive type must be a positive number'
  }
}
