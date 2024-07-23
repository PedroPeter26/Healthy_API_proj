import EdamamService from 'App/Services/EdamamService';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EdamamsController {

    public async findFood({ request, response }: HttpContextContract) {
        try {
            const foodName = request.input('food_name')
          
            if (!foodName) {
                return response.badRequest({ 
                  type: 'Error',
                  titlte: 'Error al obtener alimento',
                  error: 'Por favor, proporciona el nombre del alimento.' 
                })
            }
      
            const alimento = await EdamamService.getfood(foodName);
      
            if(alimento.hints.length==0){
              return response.notFound({ 
                type: 'Error',
                title: 'Error al obtener alimento',
                message: 'No hubo resultados' });
            }
            return response.ok({
              type: 'Exitoso',
              title: 'Alimento obtenido',
              message: 'Alimento obtenido exitosamente',
              data: alimento
            });
        } catch (error) {
            console.error('Error al buscar el alimento:', error.message);
            return response.status(500).json({ message: 'Ocurrió un error al buscar el alimento.' });
        }
    }
    
    public async calculateNutrition({ request, response }) {
        try {
      
          const unit = "gr";
          const body = request.all();
         
          const edamamResponse = await EdamamService.getNutritionDetails(body.ingr, unit)
      
          return response.json(edamamResponse.data);
        } catch (error) {
          console.error('Error al calcular la información nutricional:', error);
          return response.status(500).json({ error: 'Ocurrió un error al calcular la información nutricional.', errorMessage: error.message });
        }
    }
}
