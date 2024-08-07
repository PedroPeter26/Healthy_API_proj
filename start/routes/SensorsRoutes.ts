import Route from '@ioc:Adonis/Core/Route'


Route.group(() => {
  Route.get('/:type/sensor-types', 'SensorsController.getSensorTypes')
  Route.post('/store', 'SensorsController.store')
  Route.post('/last-data', 'SensorsController.getLastData')
  Route.post('/push-data', 'SensorsController.pushData')
  //Route.delete('/delete-dispositive', 'SensorsController.delete') //?delete
  Route.delete('/remove-sensor', 'SensorsController.destroy')
  Route.post('/sensor-list', 'SensorsController.getSensorsList')
  Route.post('/report-by-sensor', 'SensorsController.reportBySensor')
  Route.put('/update', 'SensorsController.update')
}).prefix('/api/sensors').middleware('auth')
