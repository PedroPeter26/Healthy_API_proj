import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/last-data', 'SensorsController.getLastData')
  Route.post('/push-data', 'SensorsController.pushData')
}).prefix('/api/sensors')
