import multer from "multer";
import { Commite, USER } from "../../models";
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

export const createCommite = async (req, res) => {
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

      // Update COMMITE with the subscription details
      let COMMITE = req.body;
            // Check for file upload
            
             if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
               if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
                const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                COMMITE.documents = result.secure_url;
                const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
                COMMITE.photo = result2.secure_url;
                }
               else if(req.files && req.files['photo'] && req.files['photo'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
                  COMMITE.photo = result.secure_url;
                  }
                else if(req.files && req.files['documents'] && req.files['documents'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                  COMMITE.documents = result.secure_url;
                }
            }
            else {
                COMMITE.documents = null;
                COMMITE.photo = null;
            }
            

      let newCommite = await Commite.create(COMMITE);

      const adminEmails = User
      .filter((User) => User.role === 'admin')
      .map((admin) => admin.email);
      for (const adminEmail of adminEmails) {
        try {
          await sendEmail(
            adminEmail,
            `New Commite  ${newCommite.name}`,
            `New Commite  has been created.`,
          );
          console.log(`Email sent to ${adminEmail}`);
        }
        catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
      res.status(201).json(newCommite);
    }
    );
  }
  catch (error) {
    console.error("Error creating commite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//UPDATE A COMMITE
    export const adminUpdateCommite = async (req, res) => {
      try {
        const commiteId = req.params.id;
        const updatedCommite = await Commite.findByIdAndUpdate(
      // update commite, like title, description, typeOfCommite, dateOfCommite, photo, documents
                 commiteId,
            {  
                name: req.body.name,
                description: req.body.description,
                position: req.body.position,
                duration: req.body.duration,
                photo: req.body.photo,
                documents: req.body.documents,

            },

            { new: true }   

        );
    
        if (!updatedCommite) {
          return res.status(404).json({ error: 'Commite not found' });
        }
     //send email to admins
        const User = await USER.find();
        const adminEmails = User
        .filter((User) => User.role === 'admin')
        .map((admin) => admin.email);
        for (const adminEmail of adminEmails) {
          try {
            await sendEmail(
              adminEmail,
              `Commite updated ${updatedCommite.name}`,
              `Commite has been updated.`,
            );
            console.log(`Email sent to ${adminEmail}`);
          }
          catch (emailError) {
            console.error('Error sending email:', emailError);
          }
        }
        
        return res.status(200).json(updatedCommite);
      } catch (error) {
        console.error('Error updating commite:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

//DELETET A COMMITE
export const deleteCommiteById = async (req, res) => {
const commiteId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deleteCommite = await Commite.findByIdAndDelete(commiteId);

  if (!deleteCommite) {
    return res.status(404).json({ error: "Commite not found" });
  }

  res.status(200).json({ message: "Commite deleted successfully", deleteCommite });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const commite = await Commite.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Commite (sorted from latest to oldest)',
      commite,
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
  const commiteId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const COMMITE = await Commite.findById(commiteId);

    if (!COMMITE) {
      return res.status(404).json({ error: "Commite is not found" });
    }

    res.status(200).json(COMMITE);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCommiteCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
    const commiteCountsByMonth = await Commite.aggregate([
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
      const matchingMonth = commiteCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting Commite counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
