import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('', 'HabitsController.index')
}).prefix('/api/habits').middleware('auth')
