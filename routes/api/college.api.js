const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { verifyToken } = require('../../utils/verifyUser');
const { validateColleges, validateApiKey } = require('../../middleware.js');
const apiCollegeController = require('../../controllers/api/college.controller.js');

/**
 * @swagger
 * tags:
 *   name: College
 *   description: APIs for managing colleges
 */

/**
 * @swagger
 * /api/colleges:
 *   get:
 *     summary: Get all colleges
 *     description: Fetch a list of all colleges.
 *     tags: [College]
 *     security:
 *       - ApiKeyAuth: []  # Requires API Key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: "API Key for authentication"
 *     responses:
 *       200:
 *         description: Successfully retrieved the colleges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/College"
 */
router.get('/', validateApiKey, wrapAsync(apiCollegeController.fetchCollege));

/**
 * @swagger
 * /api/colleges/{collegeId}:
 *   get:
 *     summary: Get a single college by ID
 *     description: Retrieve details of a specific college by its ID.
 *     tags: [College]
 *     security:
 *       - ApiKeyAuth: []  # Requires API Key
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: "API Key for authentication"
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: "Bearer token for authentication (Format: Bearer {token})"
 *       - in: path
 *         name: collegeId
 *         required: true
 *         description: Unique ID of the college
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the college
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/College"
 *       404:
 *         description: College not found
 */
router.get(
    '/:collegeId',
    validateApiKey,
    wrapAsync(apiCollegeController.fetchCollegeById)
);

/**
 * @swagger
 * /api/colleges:
 *   post:
 *     summary: Add a new college
 *     description: Create a new college entry.
 *     tags: [College]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *         description: "Bearer token for authentication (Format: Bearer {token})"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/College"
 *     responses:
 *       201:
 *         description: College created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid token
 */
router.post(
    '/',
    verifyToken,
    validateColleges,
    wrapAsync(apiCollegeController.createCollege)
);

module.exports = router;
