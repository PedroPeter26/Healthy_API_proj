// UserConfigurationsController.ts

/**
 * @swagger
 * tags:
 *   name: UserConfigurations
 *   description: User configurations management endpoints
 */

/**
 * @swagger
 * /api/user-conf/update:
 *   put:
 *     summary: Update user configuration
 *     description: Updates the user configuration in both PostgreSQL and MongoDB.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: The new value for the configuration.
 *                 example: "120"
 *               dispositiveId:
 *                 type: integer
 *                 description: The ID of the dispositive associated with the configuration.
 *                 example: 4
 *               configurationOptionsId:
 *                 type: integer
 *                 description: The ID of the configuration option to be updated.
 *                 example: 2
 *     responses:
 *       '200':
 *         description: Successfully updated user configuration.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated configuration.
 *                 userId:
 *                   type: integer
 *                   description: The ID of the user associated with the configuration.
 *                 dispositiveId:
 *                   type: integer
 *                   description: The ID of the dispositive associated with the configuration.
 *                 configurationOptionsId:
 *                   type: integer
 *                   description: The ID of the configuration option.
 *                 data:
 *                   type: string
 *                   description: The updated configuration data.
 *       '401':
 *         description: Unauthorized. User must be authenticated.
 *       '404':
 *         description: Configuration not found.
 *       '500':
 *         description: Failed to update configuration in MongoDB.
 *     tags:
 *       - UserConfigurations
 */