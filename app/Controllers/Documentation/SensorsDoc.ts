// SensorsController.ts

/**
 * @swagger
 * tags:
 *   name: Sensors
 *   description: Sensors management endpoints
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