import multer from "multer";
import { Sermon, USER} from "../../models";
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

export const createSermon = async (req, res) => {
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

      // Update SERMON with the subscription details
      let SERMON = req.body;
            // Check for file upload
            
             if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
               if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
                const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                SERMON.documents = result.secure_url;
                const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
                SERMON.photo = result2.secure_url;
                }
               else if(req.files && req.files['photo'] && req.files['photo'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
                  SERMON.photo = result.secure_url;
                  }
                else if(req.files && req.files['documents'] && req.files['documents'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                  SERMON.documents = result.secure_url;
                }
            }
            else {
                SERMON.documents = null;
                SERMON.photo = null;
            }
            

      let newSermon = await Sermon.create(SERMON);
      // Send email to all users emails
        const userEmails = User
        .filter((User) => User.role === 'user')
        .map((user) => user.email);
        for (const userEmail of userEmails) {
            try {
                await sendEmail(
                    userEmail,
                    `New Sermon`,
                    `New Sermon has been created.`
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
        }

      const adminEmails = User
      .filter((User) => User.role === 'admin')
      .map((admin) => admin.email);
      for (const adminEmail of adminEmails) {
        try {
          await sendEmail(
            adminEmail,
            `Sermon ${newSermon.sermonTitle}`,
            `New sermon has been created.`,
          );
          console.log(`Email sent to ${adminEmail}`);
        }
        catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
      res.status(201).json(newSermon);
    }
    );
  }
  catch (error) {
    console.error("Error creating sermon:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//UPDATE A SERMON
    export const adminUpdateSermon = async (req, res) => {
      try {
        const sermonId = req.params.id;
        const updatedSermon = await Sermon.findByIdAndUpdate(
      // update sermon, like title, description, typeOfSermon, dateOfSermon, photo, documents
            sermonId,
            { description: req.body.description, 
                typeOfSermon: req.body.typeOfSermon, 
                dateOfSermon: req.body.dateOfSermon, 
                photo: req.body.photo, 
                documents: req.body.documents ,
                sermonTitle: req.body.sermonTitle,
                mainGuest: req.body.mainGuest,
                location: req.body.location,
                duration: req.body.duration,
               
            },

            { new: true }   

        );
    
        if (!updatedSermon) {
          return res.status(404).json({ error: 'Sermon not found' });
        }
        //send email to all users and admins
        const user = await USER.find();
        const userEmails = user
          .filter((user) => user.role === 'user')
          .map((user) => user.email);
        for (const userEmail of userEmails) {
            try {
                await sendEmail(
                userEmail,
                `Sermon ${updatedSermon.sermonTitle}`,
                `Sermon has been updated.`
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
            }

        return res.status(200).json(updatedSermon);
      } catch (error) {
        console.error('Error updating sermon:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

//DELETET A SERMON
export const deleteSermonById = async (req, res) => {
const sermonId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deletedSermon = await Sermon.findByIdAndDelete(sermonId);

  if (!deletedSermon) {
    return res.status(404).json({ error: "sermon not found" });
  }

  res.status(200).json({ message: "Sermon deleted successfully", deletedSermon });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const sermon = await Sermon.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Sermons (sorted from latest to oldest)',
      sermon,
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
  const sermonId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const SERMON = await Sermon.findById(sermonId);

    if (!SERMON) {
      return res.status(404).json({ error: "Sermon is not found" });
    }

    res.status(200).json(SERMON);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSermonCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
    const sermonCountsByMonth = await Sermon.aggregate([
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
      const matchingMonth = sermonCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting Sermon counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
