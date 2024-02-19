import multer from "multer";
import { Gallery, USER } from "../../models";
import { uploaded } from "../../middleware/photoStorage";
import { sendEmail } from "../../utils";

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

export const createGallery = async (req, res) => {
  try {
    uploaded(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "File upload error" });
      } else if (err) {
        return res.status(500).json({ error: "Internal server error" });
      }

      const userId = req.userId;
      const user = await USER.findById(userId);
      const User = await USER.find();
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      req.body.createdBy = userId;

      // Update Gallery with the subscription details
      let GALLERY = req.body;
            // Check for file upload
            
             if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
               if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
                const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                GALLERY.documents = result.secure_url;
                const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
                GALLERY.photo = result2.secure_url;
                }
                
               else if(req.files && req.files['photo'] && req.files['photo'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
                  GALLERY.photo = result.secure_url;
                  }
                else if(req.files && req.files['documents'] && req.files['documents'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                  GALLERY.documents = result.secure_url;
                }
            }
            else {
                GALLERY.documents = null;
                GALLERY.photo = null;
            }
            

      let newGallery = await Gallery.create(GALLERY);
      
      res.status(201).json(newGallery);
    }
    );
  }
  catch (error) {
    console.error("Error creating gallery:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//DELETET A Gallery
export const deleteGalleryById = async (req, res) => {
const GalleryId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deleteGallery = await Gallery.findByIdAndDelete(GalleryId);

  if (!deleteGallery) {
    return res.status(404).json({ error: "Gallery not found" });
  }

  res.status(200).json({ message: "Gallery deleted successfully", deleteGallery });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Gallery (sorted from latest to oldest)',
      gallery,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};



//GET BY ID
export const getbyId = async (req, res) => {
  const galleryId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const GALLERY = await Gallery.findById(galleryId);

    if (!GALLERY) {
      return res.status(404).json({ error: "Gallery is not found" });
    }

    res.status(200).json(GALLERY);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGalleryCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
    const galleryCountsByMonth = await Gallery.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert _id values to month names
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const response = months.map((monthName, index) => {
      const matchingMonth = galleryCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting Gallery counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
