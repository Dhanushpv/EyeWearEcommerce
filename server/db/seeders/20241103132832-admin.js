
'use strict';
const bcrypt = require('bcrypt');
const accessControl = require('../models/admin'); // Import the access control model
const user_model = require('../models/usertypes'); // Import the usertype model
const mongoose = require('mongoose'); // Ensure mongoose is required

module.exports = {
  up: async (models, mongoose) => {
    try {
      // Hash the password before seeding
      const hashedPassword = await bcrypt.hash('admin@123', 10);
      
      // Check if the usertype already exists
      const existingUserType = await user_model.findOne({ _id: new mongoose.Types.ObjectId("67270b73c1c72b5d59e37415") });

      if (!existingUserType) {
        // Insert the usertype for admin if it doesn't exist
        await user_model.insertMany([
          {
            _id: new mongoose.Types.ObjectId("67270b73c1c72b5d59e37415"), // Create ObjectId for usertype
            usertype: 'Admin', // Define the usertype
          }
        ]);
      }

      // Check if the admin user already exists
      const existingAdmin = await accessControl.findOne({ _id: new mongoose.Types.ObjectId("67277aae28b629a56f307faa") });

      if (!existingAdmin) {
        // Insert the admin user with a reference to the usertype
        await accessControl.insertMany([
          {
            _id: new mongoose.Types.ObjectId("67277aae28b629a56f307faa"), // Use 'new' with ObjectId
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword, // Store hashed password
            usertype: "67270b73c1c72b5d59e37415" // Reference the usertype _id directly
          }
        ]);
      }

      console.log(`Seeding completed successfully.`);
    } catch (error) {
      console.error('Error seeding users and usertypes:', error);
    }
  },

  down: async (models, mongoose) => {
    try {
      // First, delete the admin user by ID
      const res = await accessControl.deleteMany({
        _id: new mongoose.Types.ObjectId("67277aae28b629a56f307faa"), // Use 'new' with ObjectId
      });

      // Then, delete the associated usertype
      const userTypeRes = await user_model.deleteMany({
        _id: new mongoose.Types.ObjectId("67270b73c1c72b5d59e37415"), // Use 'new' with ObjectId for usertype
      });

      console.log(`${res.deletedCount} user(s) and ${userTypeRes.deletedCount} usertype(s) deleted successfully.`);
    } catch (error) {
      console.error('Error deleting seeded users and usertypes:', error);
    }
  }
};
