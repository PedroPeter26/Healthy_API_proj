import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ConfigurationOption from 'App/Models/ConfigurationOption'

export default class extends BaseSeeder {
  public async run () {
    await ConfigurationOption.createMany([
      { id: 1, name: 'Alarma distancia' },
      { id: 2, name: 'Alarma pasos' },
      { id: 3, name: 'Meta calórica' },
      { id: 4, name: 'Alarma bpm' },
      { id: 5, name: 'Selección pantalla' }
    ])
  }
}
