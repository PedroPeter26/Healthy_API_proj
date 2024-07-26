import Route from '@ioc:Adonis/Core/Route'

// Rutas del controlador DispositivesController
Route.group(() => {
  Route.get('', 'DispositivesController.index')
  Route.get('/types', 'DispositivesController.types')
  Route.get('/show', 'DispositivesController.show')
  Route.post('/create', 'DispositivesController.create')
  Route.put('/update', 'DispositivesController.update')
  Route.delete('/destroy', 'DispositivesController.destroy')
}).prefix('api/dispositives').middleware('auth')
