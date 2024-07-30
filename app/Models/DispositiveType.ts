import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Dispositive from './Dispositive'

export default class DispositiveType extends BaseModel {
  public static table = 'dispositive_types'
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public acronym: string

  @hasMany(() => Dispositive)
  public dispositives: HasMany<typeof Dispositive>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public deletedAt: DateTime | null
}
