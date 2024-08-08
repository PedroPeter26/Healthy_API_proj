import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.put('/update', 'UserConfigurationsController.update')
  Route.get('/index', 'UserConfigurationsController.index')
}).prefix('/api/user-conf').middleware(['auth'])
