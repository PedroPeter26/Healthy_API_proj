import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class ConfigurationOption extends BaseModel {
  public static table = 'configuration_options'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public acronym: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public deletedAt: DateTime | null
}
