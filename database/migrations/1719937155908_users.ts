import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name', 255).nullable()
      table.string('lastname', 255).nullable()
      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('nickname', 180).notNullable().unique()
      table.integer('role_id').unsigned().references('id').inTable('roles').defaultTo(2)
      table.string('remember_me_token').nullable()
      table.string('verification_code', 255).nullable()
      table.boolean('active').defaultTo(false)
      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('deleted_at', { useTz: true }).nullable().defaultTo(null)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
