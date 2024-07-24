import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/last-data', 'SensorsController.getLastData')
  Route.post('/push-data', 'SensorsController.pushData')
  Route.delete('/delete-dispositive', 'SensorsController.delete')
  Route.delete('/remove-sensor', 'SensorsController.removeSensor')
}).prefix('/api/sensors')
