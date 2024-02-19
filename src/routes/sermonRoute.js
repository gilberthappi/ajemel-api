
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createSermon,adminUpdateSermon,deleteSermonById,
    getbyId,getAll,getSermonCounts
} from "../controllers/sermon";

const sermonRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Sermon
 *   description: The Sermon managing API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *      bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Sermon:
 *       type: object
 *       required:
 *         - sermonTitle
 *       properties:
 *         sermonTitle:
 *           type: string
 *           description: Title of the sermon
 *         description:
 *           type: string
 *           description: Details on the sermon
 *         typeOfSermon:
 *           type: string
 *           enum: ['baptism',  'other']
 *           description: Type of the sermon
 *         dateOfSermon:
 *           type: string
 *           description: Date of the sermon
 *         photo:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: images for showing evidences
 *         documents:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *           description: documents for explaining the sermon
 */

/**
 * @swagger
 * /Sermon/create:
 *   post:
 *     summary: Create a new sermon
 *     tags: [Sermon]
 *     description: Register a new sermon
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sermonTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               typeOfSermon:
 *                 type: string
 *                 enum: ['baptism', 'other']
 *               dateOfSermon:
 *                 type: string
 *               photo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 * 
 *             required:
 *               - sermonTitle
 *     responses:
 *       201:
 *         description: sermon registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /Sermon/getAllSermon:
 *   get:
 *     summary: Get all sermons
 *     tags: [Sermon]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all sermon
 *     responses:
 *       200:
 *         description: List of sermons
 */


/**
 * @swagger
 * /Sermon/getSermonById/{id}:
 *   get:
 *     summary: Get a sermon by ID
 *     tags: [Sermon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sermon ID
 *     responses:
 *       200:
 *         description: The sermon details by ID
 *       404:
 *         description: sermon not found
 */

/**
 * @swagger
 * /Sermon/adminUpdateSermon/{id}:
 *   put:
 *     summary: An admin may update a sermon by ID to assign it to the lawyer
 *     tags: [Sermon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sermon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                type: string
 *               typeOfSermon:
 *                type: string
 *                enum: ['baptism', 'other']
 *               dateOfSermon:  
 *                type: string
 *     responses:
 *       200:
 *         description: The sermon was updated
 *       404:
 *         description: Sermon not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /Sermon/deleteSermon/{id}:
 *   delete:
 *     summary: Delete a sermon by ID
 *     tags: [Sermon]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sermon ID
 *     responses:
 *       200:
 *         description: Sermon deleted successfully
 *       404:
 *         description: Sermon not found
 */


/**
 * @swagger
 * /Sermon/getSermonCounts:
 *   get:
 *     summary: Get counts of different sermon categories
 *     tags: [Sermon]
 *     security:
 *       - bearerAuth: []
 *     description: Count sermons  by a specified period (e.g., "year" ).
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         required: true
 *         description: The field name to search for (e.g., "2023").
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */

  sermonRouter.get('/getSermonCounts',verifyToken, getSermonCounts);
  sermonRouter.get("/getAllSermon",getAll);
  sermonRouter.post("/create",verifyToken,isAdmin,createSermon);
  sermonRouter.delete("/deleteSermon/:id",verifyToken,isAdmin,deleteSermonById);
  sermonRouter.get("/getSermonById/:id", getbyId);
  sermonRouter.put("/adminUpdateSermon/:id",verifyToken,isAdmin,adminUpdateSermon);


export default sermonRouter;
              