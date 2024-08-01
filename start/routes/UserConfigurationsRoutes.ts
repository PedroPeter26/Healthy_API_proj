import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.put('/update', 'UserConfigurationsController.update')
}).prefix('/api/user-conf').middleware(['auth'])
