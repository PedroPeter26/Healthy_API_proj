// UsersController.ts

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

    /**
     * @swagger
     * /api/users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get all users
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Users fetched
     *       500:
     *         description: Failed to fetch users
     */
  
    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get a user by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User found
     *       404:
     *         description: User not found
     */
  
    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     tags:
     *       - Users
     *     summary: Update a user by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               lastname:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               nickname:
     *                 type: string
     *     responses:
     *       200:
     *         description: User updated
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Failed to update user
     */
  
    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     tags:
     *       - Users
     *     summary: Delete a user by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User deleted
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Failed to delete user
     */

    /**
     * @swagger
     * /api/users/{id}:
     *   delete:
     *     tags:
     *       - Users
     *     summary: Delete a user by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: User deleted
     *       403:
     *         description: Unauthorized
     *       500:
     *         description: Failed to delete user
     */

  