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