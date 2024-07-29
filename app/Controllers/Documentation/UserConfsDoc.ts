// UserConfigurationsController.ts

/**
 * @swagger
 * tags:
 *   name: UserConfigurations
 *   description: User configurations management endpoints
 */

/**
   * @swagger
   * /api/user-conf/{id}:
   *   put:
   *     tags:
   *       - UserConfigurations
   *     summary: Actualiza una configuración de usuario específica
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: string
   *             required:
   *               - data
   *     responses:
   *       200:
   *         description: Configuración de usuario actualizada
   *       401:
   *         description: No estás logueado
   *       404:
   *         description: Configuración de usuario no encontrada
   */
