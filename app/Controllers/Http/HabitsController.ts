import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Habit from 'App/Models/Habit'

export default class HabitsController {
    public async index({ response }: HttpContextContract) {
        try {
          const habits = await Habit.all()
    
          return response.status(200).json({
            type: 'Success',
            title: 'Habits fetched successfully',
            data: habits,
          })
        } catch (error) {
          return response.status(500).json({
            type: 'Error',
            title: 'Failed to fetch habits',
            message: 'An unexpected error occurred. Please try again later.',
          })
        }
      }
    


}
