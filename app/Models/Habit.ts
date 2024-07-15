import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Habit extends BaseModel {
  public static table = 'habits'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: String 

  @column()
  public description: String 

  @column()
  public img: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public deletedAt: DateTime | null
}
