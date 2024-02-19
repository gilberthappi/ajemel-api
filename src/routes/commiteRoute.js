
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createCommite,adminUpdateCommite,deleteCommiteById,
    getbyId,getAll,getCommiteCounts
} from "../controllers/commite";

const commiteRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Commite
 *   description: The commite managing API
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
 *     Commite:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Title of the commite
 *         description:
 *           type: string
 *           description: Details on the commite
 *         position:
 *           type: string
 *           description: position of the commite
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
 *           description: documents for explaining the commite
 */

/**
 * @swagger
 * /commite/create:
 *   post:
 *     summary: Create a new Commite
 *     tags: [Commite]
 *     description: Register a new Commite
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               position:
 *                 type: string
 *               photo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 * 
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: commite registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /commite/getAllCommite:
 *   get:
 *     summary: Get all commite
 *     tags: [Commite]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all commite
 *     responses:
 *       200:
 *         description: List of commite
 */


/**
 * @swagger
 * /commite/getCommiteById/{id}:
 *   get:
 *     summary: Get a commite by ID
 *     tags: [Commite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The commite ID
 *     responses:
 *       200:
 *         description: The commite details by ID
 *       404:
 *         description: commite not found
 */

/**
 * @swagger
 * /commite/adminUpdateCommite/{id}:
 *   put:
 *     summary: An admin may update a commite by ID to assign it to the lawyer
 *     tags: [Commite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The commite ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                type: string
 *               name:
 *                type: string
 *               position:  
 *                type: string
 *     responses:
 *       200:
 *         description: The commite was updated
 *       404:
 *         description: commite not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /commite/deleteCommite/{id}:
 *   delete:
 *     summary: Delete a Commite by ID
 *     tags: [Commite]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Commite ID
 *     responses:
 *       200:
 *         description: Commite deleted successfully
 *       404:
 *         description: Commite not found
 */


/**
 * @swagger
 * /commite/getCommiteCounts:
 *   get:
 *     summary: Get counts of different commite categories
 *     tags: [Commite]
 *     security:
 *       - bearerAuth: []
 *     description: Count Commite  by a specified period (e.g., "year" ).
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

  commiteRouter.get('/getCommiteCounts',verifyToken, getCommiteCounts);
  commiteRouter.get("/getAllCommite",getAll);
  commiteRouter.post("/create",verifyToken,isAdmin,createCommite);
  commiteRouter.delete("/deleteCommite/:id",verifyToken,isAdmin,deleteCommiteById);
  commiteRouter.get("/getCommiteById/:id", getbyId);
  commiteRouter.put("/adminUpdateCommite/:id",verifyToken,isAdmin,adminUpdateCommite);


export default commiteRouter;
              