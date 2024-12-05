const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const accessControl =require('../utli/accessControl').accessControl
const upload = require('../utli/uploads');

function  setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next);
    }

}

router.post('/user',userController.registerUser);
router.get('/users',userController.getUsertypes);
// router.get('/Singleusertype/:id',userController.Singleusertype);
router.get('/individualUser/:id',userController.soloUser);
router.get('/fetchCategory',userController.fetchingCategory);
router.get('/fetchGender',userController.fetchingGender);
router.post('/uploadProducts', upload.array('images', 5), userController.addProducts);
router.get('/fullProductList',userController.viewAllProducts);
router.get('/SingleProductList/:id',userController.SingleProductList);
router.post('/addToCart',userController.addToCart);
router.get('/CartView',userController.CartView);
router.post('/addtowishlist',userController.addWishList);
router.post('/addAddress/:id', userController.addAddress);
router.get('/loadWishList/:id',userController.loadWishList)
router.get('/addAddressLoad/:id',userController.AddressLoad);



module.exports = router;