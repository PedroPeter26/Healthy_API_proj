
/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: Sensors management endpoints
*/

    /**
     * @swagger
     * /api/foods/get-food:
     *   get:
     *     security:
     *      - bearerAuth: []
     *     tags:
     *       - Foods
     *     summary: Obtener información sobre un alimento específico.
     *     description: Obtiene información sobre un alimento específico basado en el nombre proporcionado.
     *     parameters:
     *       - in: query
     *         name: nombrealimento
     *         description: Nombre del alimento que se desea buscar.
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Información sobre el alimento obtenida correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Mensaje de éxito.
     *                 data:
     *                   type: object
     *                   properties:
     *                     food:
     *                       type: object
     *                       description: Información sobre el alimento.
     *                     weight:
     *                       type: number
     *                       description: Peso total del alimento en gramos.
     *       400:
     *         description: Error al obtener información sobre el alimento.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   description: Mensaje de error.
     *                 error:
     *                   type: string
     *                   description: Descripción del error.
     */


    /**
     * @swagger
     * /api/foods/nutritional-properties:
     *   post:
     *     security:
     *      - bearerAuth: []
     *     tags:
     *       - Foods
     *     summary: Calcular información nutricional basada en uno o más alimentos y el peso total.
     *     description: Calcula información nutricional basada en uno o más alimentos específicos y el peso total proporcionado en gramos.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ingr:
     *                 type: array
     *                 items:
     *                   type: object
     *                   properties:
     *                     nombre:
     *                       type: string
     *                       description: Nombre del ingrediente.
     *                       example: "Chicken breast"
     *                     peso:
     *                       type: number
     *                       description: Peso del ingrediente en gramos.
     *                       example: 150
     *                 description: Lista de ingredientes con nombre y peso.
     *                 example:
     *                   - nombre: "Rice"
     *                     peso: 150
     *                   - nombre: "Banana"
     *                     peso: 120
     *     responses:
     *       200:
     *         description: Información nutricional calculada correctamente.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 uri:
     *                   type: string
     *                   description: URI única para la receta.
     *                 yield:
     *                   type: number
     *                   description: Rendimiento de la receta.
     *                 calories:
     *                   type: number
     *                   description: Calorías totales de la receta.
     *                 totalCO2Emissions:
     *                   type: number
     *                   description: Emisiones totales de CO2 de la receta.
     *                 co2EmissionsClass:
     *                   type: string
     *                   description: Clasificación de las emisiones de CO2 de la receta.
     *                 totalWeight:
     *                   type: number
     *                   description: Peso total de la receta en gramos.
     *                 dietLabels:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: Etiquetas de dieta para la receta.
     *                 healthLabels:
     *                   type: array
     *                   items:
     *                     type: string
     *                   description: Etiquetas de salud para la receta.
     *                 totalNutrients:
     *                   type: object
     *                   description: Datos nutricionales totales de la receta.
     *                 totalDaily:
     *                   type: object
     *                   description: Porcentaje diario de los nutrientes totales de la receta.
     *       400:
     *         description: Error al procesar la solicitud debido a datos faltantes o incorrectos.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Descripción del error.
     *       404:
     *         description: El alimento no fue encontrado en la base de datos externa.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Descripción del error.
     *       500:
     *         description: Error interno al calcular la información nutricional.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Descripción del error.
     */