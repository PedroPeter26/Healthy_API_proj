import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/create', 'DispositivesController.create')
}).prefix('api/dispositives').middleware('auth:api')
