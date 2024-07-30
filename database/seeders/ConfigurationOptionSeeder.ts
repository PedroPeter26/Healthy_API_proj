import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ConfigurationOption from 'App/Models/ConfigurationOption'

export default class extends BaseSeeder {
  public async run () {
    await ConfigurationOption.createMany([
      { id: 1, name: 'Alarma distancia', acronym: 'DST' },
      { id: 2, name: 'Alarma pasos', acronym: 'PSS' },
      { id: 3, name: 'Selección pantalla', acronym: 'UPS' },
      { id: 4, name: 'Alarma bpm', acronym: 'RTC' },
      { id: 5, name: 'Meta calórica', acronym: 'CAL' }
    ])
  }
}
