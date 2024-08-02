// SensorsController.ts

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: Sensors management endpoints
 */

   /**
   * @swagger
   * /api/sensors/store:
   *   post:
   *     security:
   *      - bearerAuth: []
   *     tags:
   *       - Sensors
   *     summary: Create a new sensor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               sensorTypeId:
   *                 type: integer
   *                 description: ID of the sensor type
   *               dispositiveID:
   *                 type: integer
   *                 description: ID of the dispositive
   *               active:
   *                 type: boolean
   *                 description: Whether the sensor is active
   *     responses:
   *       201:
   *         description: Sensor created successfully
   *       422:
   *         description: Validation error
   *       500:
   *         description: Internal Server Error
   */

    /**
     * @swagger
     * /api/sensors/last-data:
     *   post:
     *     security:
     *      - bearerAuth: []
     *     tags:
     *       - Sensors
     *     summary: Returns last data from certain sensor
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               dispositiveID:
     *                 type: integer
     *               sensorID:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Getting last data!
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Failed to get last data
     */

    /**
   * @swagger
   * /api/sensors/push-data:
   *   post:
   *     security:
   *      - bearerAuth: []
   *     tags:
   *       - Sensors
   *     summary: Push data to a sensor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               dispositiveID:
   *                 type: integer
   *                 description: ID of the dispositive
   *               sensorID:
   *                 type: integer
   *                 description: ID of the sensor
   *               Data:
   *                 type: object
   *                 description: Data to push to the sensor
   *     responses:
   *       200:
   *         description: Data pushed successfully
   *       500:
   *         description: Internal Server Error
   */

    /**
   * @swagger
   * /api/sensors/remove-sensor:
   *   delete:
   *     security:
   *      - bearerAuth: []
   *     tags:
   *       - Sensors
   *     summary: Remove a sensor
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               dispositiveID:
   *                 type: integer
   *                 description: ID of the dispositive
   *               sensorID:
   *                 type: integer
   *                 description: ID of the sensor
   *     responses:
   *       200:
   *         description: Sensor removed successfully
   *       404:
   *         description: Sensor not found or not removed
   *       500:
   *         description: Internal Server Error
   */

    /**
   * @swagger
   * /api/sensors/sensor-list:
   *   post:
   *     security:
   *      - bearerAuth: []
   *     tags:
   *       - Sensors
   *     summary: Get a list of sensors for a dispositive
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               dispositiveID:
   *                 type: integer
   *                 description: ID of the dispositive
   *     responses:
   *       200:
   *         description: List of sensors retrieved successfully
   *       500:
   *         description: Internal Server Error
   */


    /**
 * @swagger
 * /api/sensors/report-by-sensor:
 *   post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Sensors
 *     summary: Generar reporte por sensor
 *     description: Genera un reporte de datos para un sensor específico dentro de un rango de fechas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateBegin:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-07-14T00:00:00Z'
 *                 description: Fecha de inicio del rango de fechas.
 *               dateFinish:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-07-31T23:59:59Z'
 *                 description: Fecha de finalización del rango de fechas.
 *               sensorID:
 *                 type: number
 *                 example: 11
 *                 description: ID del sensor.
 *               dispositiveID:
 *                 type: number
 *                 example: 3
 *                 description: ID del dispositivo.
 *     responses:
 *       200:
 *         description: Reporte generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   DispositiveID:
 *                     type: number
 *                     example: 4
 *                   sensorID:
 *                     type: number
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: 'Sensor Name'
 *                   type:
 *                     type: string
 *                     example: 'Sensor Type'
 *                   userID:
 *                     type: number
 *                     example: 1
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 *                           example: '2023-07-15T10:00:00Z'
 *                         value:
 *                           type: number
 *                           example: 123.45
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid DispositiveID'
 *       404:
 *         description: No se encontraron datos para los parámetros dados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'No data found for the given parameters'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 */

    /**
   * @swagger
   * /api/sensors/update:
   *   put:
   *     tags:
   *       - Sensors
   *     summary: Update the active status of a sensor
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               sensorID:
   *                 type: integer
   *                 example: 1
   *                 description: ID of the sensor
   *               dispositiveID:
   *                 type: integer
   *                 example: 1
   *                 description: ID of the dispositive
   *               active:
   *                 type: boolean
   *                 example: true
   *                 description: New active status of the sensor
   *     responses:
   *       200:
   *         description: Sensor status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: Success
   *                 title:
   *                   type: string
   *                   example: Sensor updated!
   *                 message:
   *                   type: string
   *                   example: Sensor status updated successfully
   *                 data:
   *                   type: object
   *                   description: The updated sensor object
   *       404:
   *         description: Sensor not found or not updated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Sensor not found in relational database
   *       422:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: Error
   *                 title:
   *                   type: string
   *                   example: Validation error
   *                 message:
   *                   type: object
   *                   description: Validation error details
   *       500:
   *         description: Internal Server Error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 type:
   *                   type: string
   *                   example: Error
   *                 title:
   *                   type: string
   *                   example: Internal Server Error
   *                 message:
   *                   type: string
   *                   example: Error updating sensor
   */