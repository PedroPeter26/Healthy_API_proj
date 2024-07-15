import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Role extends BaseModel {
  public static table = 'roles'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: String

  @column()
  public slug: String

  @hasMany(() => User)
  public users: HasMany<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
