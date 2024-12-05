
'use strict';
const categories = require('../models/Categories');


module.exports = {
  up: (models, mongoose) => {

      return models.categories.insertMany([
        {
          category:"Eyeglasses",
          _id:"6734c1a96a8936054cb87ec8"

        },
        {
          category : "Screen Glasses",
          _id : "6734cba46a8936054cb87ecb"
          
        },
        {
          category : "Kids Glasses",
          _id : "6734cc686a8936054cb87ecc"
        },
        {
          category : "Contact Lenses",
          _id : "6734cca16a8936054cb87ecd"

        },
        {
          category : "Sunglasses",
          _id : "6734ce466a8936054cb87ece"
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
    
  },

  down: (models, mongoose) => {
   
      return models.categories.deleteMany({
        _id : {
          $in :[
            "6734c1a96a8936054cb87ec8",
            "6734cba46a8936054cb87ecb",
            "6734cc686a8936054cb87ecc",
            "6734cca16a8936054cb87ecd",
            "6734ce466a8936054cb87ece"
          ]
        }

      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    
  }
};
