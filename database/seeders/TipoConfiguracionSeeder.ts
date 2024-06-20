import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TipoConfiguracion from 'App/Models/TipoConfiguracion'

export default class extends BaseSeeder {
  public async run () {
    await TipoConfiguracion.createMany([
      { id: 1, name: 'alarma_distancia' },
      { id: 2, name: 'alarma_pasos' },
      { id: 3, name: 'meta_calorica' },
      { id: 4, name: 'alarma_temperatura' },
      { id: 5, name: 'alarma bpm' }
    ])
  }
}
