
// DispositivesController.ts

/**
 * @swagger
 * tags:
 *   name: Dispositives
 *   description: Dispositive management endpoints
 */

 /**
  * @swagger
  * /api/dispositives:
  *   get:
  *     tags:
  *       - Dispositives
  *     summary: Get all dispositives
  *     responses:
  *       200:
  *         description: List of dispositives
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Dispositive'
  *       500:
  *         description: Unable to fetch dispositives
  */

 /**
  * @swagger
  * /api/dispositives/show:
  *   get:
  *     tags:
  *       - Dispositives
  *     summary: Get dispositives for authenticated user
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: List of user's dispositives
  *         content:
  *           application/json:
  *             schema:
  *               type: array
  *               items:
  *                 $ref: '#/components/schemas/Dispositive'
  *       401:
  *         description: You are not logged in
  *       500:
  *         description: Unable to fetch dispositives for the user
  */

 /**
  * @swagger
  * /api/dispositives/create:
  *   post:
  *     tags:
  *       - Dispositives
  *     summary: Create a new dispositive
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/CreateDispositive'
  *     responses:
  *       201:
  *         description: Dispositive created successfully
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Dispositive'
  *       401:
  *         description: You are not logged in
  *       409:
  *         description: Dispositive name already exists
  */

 /**
  * @swagger
  * /api/dispositives/update:
  *   put:
  *     tags:
  *       - Dispositives
  *     summary: Update a dispositive
  *     security:
  *       - bearerAuth: []
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/UpdateDispositive'
  *     responses:
  *       200:
  *         description: Dispositive updated successfully
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Dispositive'
  *       401:
  *         description: You are not logged in
  *       404:
  *         description: Dispositive not found or you do not have permission to update this dispositive
  */

 /**
  * @swagger
  * /api/dispositives/destroy:
  *   delete:
  *     tags:
  *       - Dispositives
  *     summary: Delete a dispositive
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - in: query
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *     responses:
  *       200:
  *         description: Dispositive deleted successfully
  *       401:
  *         description: You are not logged in
  *       404:
  *         description: Dispositive not found or you do not have permission to delete this dispositive
  */

// Definiciones de los esquemas para Swagger
/**
 * @swagger
 * components:
 *   schemas:
 *     Dispositive:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         dispositiveTypeId:
 *           type: integer
 *         userId:
 *           type: integer
 *     CreateDispositive:
 *       type: object
 *       required:
 *         - name
 *         - dispositiveTypeId
 *       properties:
 *         name:
 *           type: string
 *         dispositiveTypeId:
 *           type: integer
 *     UpdateDispositive:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         dispositiveTypeId:
 *           type: integer
 */