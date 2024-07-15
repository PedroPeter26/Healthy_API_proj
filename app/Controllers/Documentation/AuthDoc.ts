// AuthController.ts

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */
  
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Register a new user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *               nickname:
     *                 type: string
     *               name:
     *                 type: string
     *               lastname:
     *                 type: string
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Bad request
     */
  
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Log in a user
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               uid:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login successful
     *       400:
     *         description: Invalid credentials
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: An unexpected error occurred
     */
  
    /**
     * @swagger
     * /api/auth/logout:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Log out a user
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Logout successful
     *       400:
     *         description: Logout failed
     */
  
    /**
     * @swagger
     * /api/auth/verify-account:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Verify a user's account
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               verificationCode:
     *                 type: string
     *     responses:
     *       200:
     *         description: Account verified
     *       400:
     *         description: Invalid verification code
     *       500:
     *         description: An unexpected error occurred
     */
  
    /**
     * @swagger
     * /api/auth/forgot-password:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Request a password reset
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *     responses:
     *       200:
     *         description: Verification code sent
     *       404:
     *         description: User not found
     */
  
    /**
     * @swagger
     * /api/auth/new-password:
     *   post:
     *     tags:
     *       - Auth
     *     summary: Reset a user's password
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               verificationCode:
     *                 type: string
     *               newPassword:
     *                 type: string
     *     responses:
     *       200:
     *         description: Password updated
     *       400:
     *         description: Invalid verification code
     *       500:
     *         description: Failed to update password
     */
  