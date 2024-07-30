import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DispositiveType from 'App/Models/DispositiveType'

export default class extends BaseSeeder {
  public async run () {
    await DispositiveType.createMany([
      { id: 1, name: 'Brazalete', acronym: 'BRZ' },
      { id: 2, name: 'Pesa', acronym: 'PSA' },
    ])
  }
}
