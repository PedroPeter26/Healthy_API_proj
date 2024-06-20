import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TipoDispositivo from 'App/Models/TipoDispositivo'

export default class extends BaseSeeder {
  public async run () {
    await TipoDispositivo.createMany([
      { id: 1, name: 'brazalete' },
      { id: 2, name: 'pesa' },
    ])
  }
}
