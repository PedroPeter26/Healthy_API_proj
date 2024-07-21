import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import SensorType from 'App/Models/SensorType'

export default class extends BaseSeeder {
  public async run () {
    await SensorType.createMany([
      { id: 1, name: 'Ritmo', unit: 'bpm' },
      { id: 2, name: 'Peso', unit: 'gr' },
      { id: 3, name: 'Temperatura', unit: '°C' },
      { id: 4, name: 'Alcohol', unit: '%' },
      { id: 5, name: 'Distancia', unit: 'm' },
      { id: 6, name: 'Pasos', unit: 'step' },
      { id: 7, name: 'Pantalla', unit: 'mode' },
      { id: 8, name: 'Tiempo', unit: 'hrs' } //?Poner en "Pesa" mongo
    ])
  }
}
