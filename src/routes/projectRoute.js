
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createProject,adminUpdateProject,deleteProjectById,
    getbyId,getAll,getProjectCounts
} from "../controllers/project";

const projectRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Project
 *   description: The Project managing API
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
 *     Project:
 *       type: object
 *       required:
 *         - projectTitle
 *       properties:
 *         projectTitle:
 *           type: string
 *           description: Title of the Project
 *         description:
 *           type: string
 *           description: Details on the Project
 *         typeOfProject:
 *           type: string
 *           description: Type of the Project
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
 *           description: documents for explaining the Project
 */

/**
 * @swagger
 * /project/create:
 *   post:
 *     summary: Create a new Project
 *     tags: [Project]
 *     description: Register a new Project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               projectTitle:
 *                 type: string
 *               description:
 *                 type: string
 *               typeOfProject:
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
 *               -projectTitle
 *     responses:
 *       201:
 *         description: Project registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /project/getAllProject:
 *   get:
 *     summary: Get all Project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all Project
 *     responses:
 *       200:
 *         description: List of Project
 */


/**
 * @swagger
 * /project/getProjectById/{id}:
 *   get:
 *     summary: Get a Project by ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     responses:
 *       200:
 *         description: The Project details by ID
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /project/adminUpdateProject/{id}:
 *   put:
 *     summary: An admin may update a Project by ID to assign it to the lawyer
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                type: string
 *               typeOfProject:
 *                type: string
 *     responses:
 *       200:
 *         description: The Project was updated
 *       404:
 *         description: Project not found
 *       500:
 *         description: Some error occurred
 */


/**
 * @swagger
 * /project/deleteProject/{id}:
 *   delete:
 *     summary: Delete a Project by ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */


/**
 * @swagger
 * /project/getProjectCounts:
 *   get:
 *     summary: Get counts of different Project categories
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     description: Count Project  by a specified period (e.g., "year" ).
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

  projectRouter.get('/getProjectCounts',verifyToken, getProjectCounts);
  projectRouter.get("/getAllProject",getAll);
  projectRouter.post("/create",verifyToken,isAdmin,createProject);
  projectRouter.delete("/deleteProject/:id",verifyToken,isAdmin,deleteProjectById);
  projectRouter.get("/getProjectById/:id", getbyId);
  projectRouter.put("/adminUpdateProject/:id",verifyToken,isAdmin,adminUpdateProject);


export default projectRouter;
              