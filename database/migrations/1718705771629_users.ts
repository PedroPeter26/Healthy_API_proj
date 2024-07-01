import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).nullable()
      table.string('lastname', 255).nullable()
      table.string('email', 255).notNullable().unique()
      table.string('nickname', 180).notNullable().unique()
      table.string('phone', 10).notNullable().unique()
      table.timestamp('email_verified_at', { useTz: true }).nullable()
      table.string('verification_code', 255).nullable()
      table.string('password', 255).notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
