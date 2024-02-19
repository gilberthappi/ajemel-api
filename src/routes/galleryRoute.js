
import express  from "express";
import { isAdmin,uploaded,verifyToken} from "../middleware";
import {
    createGallery,deleteGalleryById,
    getbyId,getAll,getGalleryCounts
} from "../controllers/gallery";

const galleryRouter = express.Router();


/**
 * @swagger
 * tags:
 *   name: Gallery
 *   description: The Gallery managing API
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
 *     Gallery:
 *       type: object
 *       properties:
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
 *           description: documents for explaining the Gallery
 */

/**
 * @swagger
 * /gallery/create:
 *   post:
 *     summary: Create a new Gallery
 *     tags: [Gallery]
 *     description: Register a new Gallery
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       201:
 *         description: Gallery registered successfully
 *       400:
 *         description: Bad Request - Invalid data
 */

/**
 * @swagger
 * /gallery/getAllGallery:
 *   get:
 *     summary: Get all Gallery
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all Gallery
 *     responses:
 *       200:
 *         description: List of Gallery
 */


/**
 * @swagger
 * /gallery/getGalleryById/{id}:
 *   get:
 *     summary: Get a Gallery by ID
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Gallery ID
 *     responses:
 *       200:
 *         description: The Gallery details by ID
 *       404:
 *         description: Gallery not found
 */

/**
 * @swagger
 * /gallery/deleteGallery/{id}:
 *   delete:
 *     summary: Delete a Gallery by ID
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Gallery ID
 *     responses:
 *       200:
 *         description: Gallery deleted successfully
 *       404:
 *         description: Gallery not found
 */


/**
 * @swagger
 * /gallery/getGalleryCounts:
 *   get:
 *     summary: Get counts of different Gallery categories
 *     tags: [Gallery]
 *     security:
 *       - bearerAuth: []
 *     description: Count Gallery  by a specified period (e.g., "year" ).
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

  galleryRouter.get('/getGalleryCounts',verifyToken, getGalleryCounts);
  galleryRouter.get("/getAllGallery",getAll);
  galleryRouter.post("/create",verifyToken,isAdmin,createGallery);
  galleryRouter.delete("/deleteGallery/:id",verifyToken,isAdmin,deleteGalleryById);
  galleryRouter.get("/getGalleryById/:id", getbyId);
 


export default galleryRouter;
              