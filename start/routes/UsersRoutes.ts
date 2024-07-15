import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/users', 'UsersController.index')
  Route.get('/users/:id', 'UsersController.show')
  Route.put('/users/:id', 'UsersController.update')
  Route.delete('/users/:id', 'UsersController.destroy')
}).prefix('api').middleware('auth:api')
