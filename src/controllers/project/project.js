import multer from "multer";
import { Project, USER } from "../../models";
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

export const createProject = async (req, res) => {
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

      // Update Project with the subscription details
      let PROJECT = req.body;
            // Check for file upload
            
             if(req.files && req.files['documents'] && req.files['documents'][0] || req.files && req.files['photo'] && req.files['photo'][0]) {
               if(req.files && req.files['documents'] && req.files['documents'][0] && req.files && req.files['photo'] && req.files['photo'][0]) {
                const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                PROJECT.documents = result.secure_url;
                const result2 = await cloudinary.uploader.upload(req.files['photo'][0].path);
                PROJECT.photo = result2.secure_url;
                }
               else if(req.files && req.files['photo'] && req.files['photo'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['photo'][0].path);
                  PROJECT.photo = result.secure_url;
                  }
                else if(req.files && req.files['documents'] && req.files['documents'][0]) {
                  const result = await cloudinary.uploader.upload(req.files['documents'][0].path);
                  PROJECT.documents = result.secure_url;
                }
            }
            else {
                PROJECT.documents = null;
                PROJECT.photo = null;
            }
            

      let newProject = await Project.create(PROJECT);
      // Send email to all users emails
        const userEmails = User
        .filter((User) => User.role === 'user')
        .map((user) => user.email);
        for (const userEmail of userEmails) {
            try {
                await sendEmail(
                    userEmail,
                    `New Project ${newProject.projectTitle}`,
                    `New Project has been created.`,
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
            `New Project ${newProject.projectTitle}`,
            `New Project has been created.`,
          );
          console.log(`Email sent to ${adminEmail}`);
        }
        catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      }
      res.status(201).json(newProject);
    }
    );
  }
  catch (error) {
    console.error("Error creating new Project:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


    const { ObjectId } = require('mongoose').Types;

//UPDATE A PROJECT
    export const adminUpdateProject = async (req, res) => {
      try {
        const projectId = req.params.id;
        const updatedProject = await Project.findByIdAndUpdate(
      // update project, like title, description,  photo, documents
               projectId,
            {   projectTitle: req.body.projectTitle,
                typeOfProject: req.body.typeOfProject,
                description: req.body.description,
                photo: req.body.photo,
                documents: req.body.documents,
                duration: req.body.duration,
                location: req.body.location,
               
            },

            { new: true }   

        );
    
        if (!updatedProject) {
          return res.status(404).json({ error: 'Project not found' });
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
                `Project ${updatedProject.projectTitle}`,
                `Project has been updated.`
                );
                console.log(`Email sent to ${userEmail}`);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
            }
            }

        return res.status(200).json(updatedProject);
      } catch (error) {
        console.error('Error updating Project:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };

//DELETET A PROJECT
export const deleteProjectById = async (req, res) => {
const projectId = req.params.id; // Assuming the ID is passed as a URL parameter

try {
  const deleteProject = await Project.findByIdAndDelete(projectId);

  if (!deleteProject) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.status(200).json({ message: "Project deleted successfully", deleteProject });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
}
};



export const getAll = async (req, res) => {
  try {
    const project = await Project.find().sort({ createdAt: -1 }); // Sort from latest to oldest
    res.status(200).json({
      message: 'All Project (sorted from latest to oldest)',
      project,
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
  const projectId = req.params.id; // Assuming the ID is passed as a URL parameter

  try {
    const PROJECT = await Project.findById(projectId);

    if (!PROJECT) {
      return res.status(404).json({ error: "Project is not found" });
    }

    res.status(200).json(PROJECT);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProjectCounts = async (req, res) => {
  const { year } = req.query;

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Aggregation count within the specified year range
    const projectCountsByMonth = await Project.aggregate([
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
      const matchingMonth = projectCountsByMonth.find(
        (entry) => entry._id === index + 1
      );
      return {
        label: monthName,
        count: matchingMonth ? matchingMonth.count : 0,
      };
    });
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting project counts by month:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
