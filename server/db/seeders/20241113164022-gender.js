'use strict';
const gender = require('../models/gender');
module.exports = {
  up: (models, mongoose) => {

      return models.Gender.insertMany([
        {
          gender : "Men",
          _id : "6734d7cb6a8936054cb87ed1"
         
        },
        {
          gender : "Womens",
          _id : "6734dbaa6a8936054cb87ed2"

        },
        {

          gender : "Unisex",
          _id : "67357b82dedb9fb4651fd52e"

        },
        {
          gender : "Kids",
          _id : "6734dc3c6a8936054cb87ed3"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {

      return models.Gender.deleteMany({
        _id : {
          $in : [
            "6734d7cb6a8936054cb87ed1",
            "6734dbaa6a8936054cb87ed2",
            "6734dc3c6a8936054cb87ed3",
            "67357b82dedb9fb4651fd52e"
          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    
  }
};
