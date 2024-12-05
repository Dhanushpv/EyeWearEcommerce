const usertypes = require ('../models/usertypes')
'use strict';

module.exports = {
  up: (models, mongoose) => {
   
      return models.usertypes.insertMany([
       {
        _id : "67270b73c1c72b5d59e37415",
        usertype : "Admin"
       },
       {
        _id : "67270b9ec1c72b5d59e37416",
        usertype : "Buyer"
       },
       {
        _id : "67270bd1c1c72b5d59e37417",
        usertype : "Seller"
       }
       
      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
   
  },

  down: (models, mongoose) => {
    
      return models.usertypes.deleteMany({
        _id :{
          $in :[
            "67270b73c1c72b5d59e37415",
            "67270b9ec1c72b5d59e37416",
            "67270bd1c1c72b5d59e37417"

          ]
        }
      }).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
  }
};
