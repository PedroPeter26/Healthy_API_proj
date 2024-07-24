import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Sensor from './Sensor'

export default class SensorType extends BaseModel {
  public static table = 'sensor_types'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public unit: string

  @hasMany(() => Sensor)
  public sensors: HasMany<typeof Sensor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public deletedAt: DateTime | null
}
