import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Habit from 'App/Models/Habit'

export default class extends BaseSeeder {
  public async run () {
    await Habit.createMany([
      { id: 1, name: 'Control de Alcohol', description: 'Controla tu consumo de alcohol y fija objetivos' },
      { id: 2, name: 'Monitoreo actividad física', description: 'Visualiza tus pasos, distancia recorrida y ritmo cardíaco' },
      { id: 3, name: 'Ayuda para dietas', description: 'Registra lo que comes en el día y controla tus calorías' },
      { id: 4, name: 'Termómetro', description: 'Obtén tu temperatura corporal a tiempo real' },
      { id: 5, name: 'Control de pantalla', description: 'Elige qué parámetros quieres ver en la pantalla de tu brazalete' },
    ])
  }
}
