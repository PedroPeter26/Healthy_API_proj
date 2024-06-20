import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sensors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('sensor_type_id').unsigned().references('id').inTable('sensor_types').onDelete('CASCADE').nullable()
      table.integer('dispositivo_id').unsigned().references('id').inTable('dispositivos').onDelete('CASCADE').nullable()
      table.boolean('activo').nullable()
      table.decimal('value', 10, 2).nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
