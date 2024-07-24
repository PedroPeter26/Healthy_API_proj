import Route from '@ioc:Adonis/Core/Route'

Route.group(()=>{
    Route.post('/get-food','EdamamsController.findFood')
    Route.post('/nutritional-properties','EdamamsController.calculateNutrition')
}).prefix('/api/foods')
