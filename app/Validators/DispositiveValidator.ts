import { schema, rules } from '@ioc:Adonis/Core/Validator'

// Validador para crear un dispositivo
export class CreateDispositiveValidator {
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
    'dispositiveTypeId.required': 'The dispositive type is required',
    'dispositiveTypeId.unsigned': 'The dispositive type must be a positive number'
  }
}

// Validador para actualizar un dispositivo
export class UpdateDispositiveValidator {
  public schema = schema.create({
    id: schema.number([
      rules.required()
    ]),
    name: schema.string.optional({ trim: true }, [
      rules.maxLength(255)
    ]),
    dispositiveTypeId: schema.number.optional([
      rules.unsigned()
    ])
  })

  public messages = {
    'id.required': 'The id is required',
    'name.maxLength': 'The name cannot be longer than 255 characters',
    'dispositiveTypeId.unsigned': 'The dispositive type must be a positive number'
  }
}

// Validador para agregar sensor a un dispositivo
export default class AddSensorsValidator {
  public schema = schema.create({
    dispositiveId: schema.number(),
    sensorTypeIds: schema.array().members(schema.number())
  })

  public messages = {
    'dispositiveId.required': 'Dispositive ID is required',
    'sensorTypeIds.required': 'Sensor Type IDs are required',
    'sensorTypeIds.array': 'Sensor Type IDs must be an array of numbers',
  }
}