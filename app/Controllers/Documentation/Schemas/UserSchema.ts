/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's first name
 *         lastname:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email address
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *         nickname:
 *           type: string
 *           description: The user's nickname
 *         roleId:
 *           type: integer
 *           description: The user's role ID
 *         rememberMeToken:
 *           type: string
 *           nullable: true
 *           description: The remember me token
 *         verificationCode:
 *           type: string
 *           nullable: true
 *           description: The verification code for account activation
 *         active:
 *           type: boolean
 *           description: The user's account status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: The date and time when the user was deleted
 *       required:
 *         - id
 *         - name
 *         - lastname
 *         - email
 *         - password
 *         - nickname
 *         - roleId
 *         - active
 *         - createdAt
 *         - updatedAt
 */
