import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Habit from 'App/Models/Habit'

export default class extends BaseSeeder {
  public async run () {
    await Habit.createMany([
      {
        id: 1,
        name: 'Control de Alcohol',
        description: 'Controla tu consumo de alcohol y fija objetivos',
        img: 'https://placekitten.com/200/300'
      },
      {
        id: 2,
        name: 'Monitoreo actividad física',
        description: 'Visualiza tus pasos, distancia recorrida y ritmo cardíaco',
        img: 'https://images.dog.ceo/breeds/terrier-tibetan/n02097474_425.jpg'
      },
      {
        id: 3,
        name: 'Ayuda para dietas',
        description: 'Registra lo que comes en el día y controla tus calorías',
        img: 'https://images.dog.ceo/breeds/coonhound/n02089078_2174.jpg'
      },
      {
        id: 4,
        name: 'Termómetro',
        description: 'Obtén tu temperatura corporal a tiempo real',
        img: 'https://images.dog.ceo/breeds/puggle/IMG_084828.jpg'
      },
      {
        id: 5,
        name: 'Control de pantalla',
        description: 'Elige qué parámetros quieres ver en la pantalla de tu brazalete',
        img: 'https://images.dog.ceo/breeds/akita/An_Akita_Inu_resting.jpg'
      },
    ])
  }
}
