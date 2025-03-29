const express = require('express');
const {
    signin,
    signup,
    google,
    signout,
} = require('../../controllers/api/auth.controller.js');
const { validateApiKey } = require('../../middleware.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs for user login, registration, and Google sign-in
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user.
 *     tags: [Auth]
 *     security:
 *       - ApiKeyAuth: []  # Requires API Key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: "API Key for authentication"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/signup', validateApiKey, wrapAsync(signup));

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User signin
 *     description: Authenticate user and generate a token.
 *     tags: [Auth]
 *     security:
 *       - ApiKeyAuth: []  # Requires API Key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: "API Key for authentication"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       401:
 *         description: Unauthorized - Invalid credentials
 */
router.post('/signin', validateApiKey, wrapAsync(signin));

router.post('/google', validateApiKey, wrapAsync(google));

/**
 * @swagger
 * /api/auth/signout:
 *   get:
 *     summary: User signout
 *     description: Logs out the current user.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully signed out
 */
router.get('/signout', signout);

module.exports = router;
