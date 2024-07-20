import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/last-data', 'SensorsController.getLastData')
}).prefix('/api/sensors')
