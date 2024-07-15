import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import DispositiveType from './DispositiveType'
import User from './User'
import Sensor from './Sensor'

export default class Dispositive extends BaseModel {
  public static table = 'dispositives'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public dispositiveTypeId: number

  @belongsTo(() => DispositiveType)
  public dispositiveType: BelongsTo<typeof DispositiveType>

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => Sensor)
  public sensors: HasMany<typeof Sensor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public deletedAt: DateTime | null
}
