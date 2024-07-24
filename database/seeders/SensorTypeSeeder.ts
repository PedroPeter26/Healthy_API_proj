import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SensorType from 'App/Models/SensorType'

export default class extends BaseSeeder {
  public async run () {
    await SensorType.createMany([
      { id: 1, name: 'Ritmo', unit: 'bpm' },
      { id: 2, name: 'Pasos', unit: 'step' },
      { id: 3, name: 'Distancia', unit: 'm' },
      { id: 4, name: 'Temperatura', unit: '°C' },
      { id: 5, name: 'Alcohol', unit: '%' },
      { id: 6, name: 'Pantalla', unit: 'mode' },
      { id: 7, name: 'Peso', unit: 'gr' },
      { id: 8, name: 'Tiempo', unit: 'hrs' } //TODO: Poner en "Pesa" mongo
    ])
  }
}
