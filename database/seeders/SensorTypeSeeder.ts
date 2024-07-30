import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SensorType from 'App/Models/SensorType'

export default class extends BaseSeeder {
  public async run () {
    await SensorType.createMany([
      { id: 1, name: 'Ritmo', unit: 'bpm', acronym: 'RTC' },
      { id: 2, name: 'Pasos', unit: 'step', acronym: 'PSS' },
      { id: 3, name: 'Distancia', unit: 'm', acronym: 'DST' },
      { id: 4, name: 'Temperatura', unit: '°C', acronym: 'TMP' },
      { id: 5, name: 'Alcohol', unit: '%', acronym: 'ALC' },
      { id: 6, name: 'Pantalla', unit: 'mode', acronym: 'PAN' },
      { id: 7, name: 'Peso', unit: 'gr', acronym: 'PSO' },
      { id: 8, name: 'Tiempo', unit: 'hrs', acronym: 'RLJ' } //TODO: Poner en "Pesa" mongo
    ])
  }
}
