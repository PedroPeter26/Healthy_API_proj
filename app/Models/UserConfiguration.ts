import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import ConfigurationOption from './ConfigurationOption'
import Dispositive from './Dispositive'

export default class UserConfiguration extends BaseModel {
  public static table = 'user_configurations'
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public dispositiveId: number

  @belongsTo(() => Dispositive)
  public dispositive: BelongsTo<typeof Dispositive>

  @column()
  public configurationOptionsId: number

  @belongsTo(() => ConfigurationOption)
  public configurationOption: BelongsTo<typeof ConfigurationOption>

  @column()
  public data: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public deletedAt: DateTime | null
}
