import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import SensorType from './SensorType'
import Dispositive from './Dispositive'

export default class Sensor extends BaseModel {
  public static table = 'sensors'

  @column({ isPrimary: true })
  public id: number

  @column()
  public sensorTypeId: number

  @belongsTo(() => SensorType)
  public sensorType: BelongsTo<typeof SensorType>

  @column()
  public dispositiveId: number

  @belongsTo(() => Dispositive)
  public dispositive: BelongsTo<typeof Dispositive>

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public deletedAt: DateTime | null
}
