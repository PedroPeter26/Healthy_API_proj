import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, BelongsTo, belongsTo, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Dispositive from './Dispositive'
import UserConfiguration from './UserConfiguration'

export default class User extends BaseModel {
  public static table = 'users'

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public nickname: string

  @column()
  public roleId: number

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @column()
  public rememberMeToken: string | null

  @column()
  public verificationCode: string | null;

  @column()
  public active: Boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({})
  public deletedAt: DateTime | null

  @hasMany(() => Dispositive, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public dispositive: HasMany<typeof Dispositive>

  @hasMany(() => UserConfiguration, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public userConfiguration: HasMany<typeof UserConfiguration>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
