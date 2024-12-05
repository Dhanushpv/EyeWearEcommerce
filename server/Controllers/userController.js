let users = require('../db/models/user');
let Usertype = require('../db/models/usertypes');
let Categories = require('../db/models/Categories');
let Gender = require('../db/models/gender');
let AddData = require('../db/models/addProduct');
const { success_function, error_function } = require('../utli/ResponseHandler');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');




exports.registerUser = async function (req, res) {
    try {
        let body = req.body;
        console.log("body", body);
        let Password = req.body.password

        // Find user type by name
        let user_type = await Usertype.findOne({ usertype: body.usertype });
        if (!user_type) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Invalid user type"
            });
        }

        console.log("user type", user_type);
        let id = user_type._id;  // Get the ObjectId
        console.log("id", id);

        // Assign the ObjectId to the usertype field
        body.usertype = id;


        let salt = bcrypt.genSaltSync(10);
        let hashedpasword = bcrypt.hashSync(Password, salt);
        console.log("password : ", hashedpasword)

        let data = {
            name: body.name,
            email: body.email,
            phone_no: body.phone_no,
            password: hashedpasword,
            usertype: body.usertype

        }

        let existingUser = await users.findOne({ email: body.email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Email already exists"
            });
        }



        // Create the new user with the correct usertype ObjectId
        let userData = await users.create(data);
        console.log('userData', userData);

        let response = success_function({
            success: true,
            statuscode: 200,
            message: "User successfully added.",
            data: userData
        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;
    }
}

exports.getUsertypes = async function (req, res) {
    try {

        let usertypes = await Usertype.find({ usertype: { $ne: 'Admin' } });
        console.log("usertypes :", usertypes);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: usertypes,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;


    } catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;
    }


}

// exports.Singleusertype = async function (req, res) {

//     try {

//         SingleUsertype = req.params.id
//         console.log("SingleUsertype", SingleUsertype);

//         SingleData = await Usertype.findOne({ _id: SingleUsertype });
//         console.log("SingleUser", SingleData);

//         let response = success_function({
//             success: true,
//             statuscode: 200,
//             data: SingleData,
//             message: "successfully get the single data.."
//         })
//         res.status(response.statuscode).send(response)
//         return;

//     } catch (error) {

//         console.log("error : ", error);
//         let response = error_function({
//             success: false,
//             statuscode: 400,

//             message: "error"
//         })
//         res.status(response.statuscode).send(response)
//         return;
//     }


// }

exports.soloUser = async function (req, res) {

    try {

        Singleid = req.params.id
        console.log("Singleid", Singleid);

        SingleData = await users.findOne({ _id: Singleid });
        console.log("SingleUser", SingleData);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: SingleData,
            message: "successfully get the single data.."
        })
        res.status(response.statuscode).send(response)
        return;

    } catch (error) {

        console.log("error : ", error);
        let response = error_function({
            success: false,
            statuscode: 400,

            message: "error"
        })
        res.status(response.statuscode).send(response)
        return;
    }

}

exports.fetchingCategory = async function (req, res) {

    try {

        let categories = await Categories.find()
        console.log("categories", categories);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: categories,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;

    }

}

exports.fetchingGender = async function (req, res) {

    try {

        let gender = await Gender.find()
        console.log("categories", gender);

        let response = success_function({
            success: true,
            statuscode: 200,
            data: gender,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;

    }

}

exports.addProducts = async (req, res) => {
    try {
        const body = req.body;

        // Fetch related data
        const category = await Categories.findOne({ category: body.category });
        console.log("category",category)

        let category_id = category._id;
        console.log("category_id",category_id);
        body.category=category_id



        const gender = await Gender.findOne({ gender: body.gender });
        console.log("gender",gender)

        let gender_id = gender._id;
        console.log("gender_id",gender_id);
        body.gender=gender_id

        

        // Log the uploaded files to debug
        console.log("Uploaded Files:", req.files);  // Should show the files

        // Prepare images if files are uploaded
        const images = (req.files || []).map(file => ({
            url: file.path,  // Store the file path
            alt: req.body.altText || 'Product Image',  // Optional alt text
        }));
        body.images =images


        const productData = await AddData.create(body);
        console.log(productData);
        res.status(200).send({ success: true, message: 'Product successfully added.', data: productData });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(400).send({ success: false, message: "Error adding product" });
    }
};

exports.viewAllProducts = async (req, res) => {
    try {



        let productOverview = await AddData.find().populate('category').populate('gender');

        let response = success_function({
            success: true,
            statuscode: 200,
            data: productOverview,
            message: "User successfully added.",

        });
        res.status(response.statuscode).send(response);
        return;

    }

    catch (error) {

        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error adding user"
        });
        res.status(response.statuscode).send(response);
        return;
    }
}

exports.SingleProductList = async (req, res) => {
    try {
      
        Singleid = req.params.id
        console.log("Singleid",Singleid);

        SingleData = await AddData.findOne({_id :Singleid});
        console.log("SingleUser",SingleData);

        let response = success_function({
            success: true,
            statuscode: 200,
            data : SingleData,
            message: "successfully get the single data.."
        })
        res.status(response.statuscode).send(response)
        return;



    } catch (error) {
        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 500,
            message: "Error fetching product"
        });
        res.status(response.statuscode).send(response);
        return;
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Validate quantity
        if (!quantity || quantity < 1) {
            let response = error_function({
                success: false,
                statuscode: 400,
                message: "Quantity must be at least 1"
            });
            return res.status(response.statuscode).send(response);
        }

        // Fetch user
        const user = await users.findById(userId);
        if (!user) {
            let response = error_function({
                success: false,
                statuscode: 404,
                message: "User not found!"
            });
            return res.status(response.statuscode).send(response);
        }

        // Fetch product
        const product = await AddData.findById(productId);
        if (!product) {
            let response = error_function({
                success: false,
                statuscode: 404,
                message: "Product not found!"
            });
            return res.status(response.statuscode).send(response);
        }

        const price = product.price; // Get the price from the product

        // Check if the user already has a cart
        let cart = user.addCart[0]; // Assuming there's only one cart per user

        if (!cart) {
            // Create a new cart if none exists
            cart = { items: [], totalPrice: 0 };
            user.addCart.push(cart);
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.items.findIndex(item => item.productId?.toString() === productId);

        if (existingProductIndex !== -1) {
            // Update quantity and price if product exists
            cart.items[existingProductIndex].quantity += quantity;
        } else {
            // Add the new product to the cart
            cart.items.push({ productId, quantity, price });
        }
        console.log(existingProductIndex)

        // Recalculate the cart's total price
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

        // Save updated user data
        await user.save();

        let response = success_function({
            success: true,
            statuscode: 200,
            data: user,
            message: "Item successfully added to the cart."
        });
        res.status(response.statuscode).send(response);
    } catch (error) {
        console.error("Error: ", error);
        let response = error_function({
            success: false,
            statuscode: 500,
            message: "Internal server error"
        });
        res.status(response.statuscode).send(response);
    }
};

exports.CartView = async (req, res) => {
    try {
        // Fetch only the `addcart` field from all users
        let Cartview = await users.find();

        let response = success_function({
            success: true,
            statuscode: 200,
            data: Cartview,
            message: "Cart items fetched successfully.",
        });
        res.status(response.statuscode).send(response);
        return;

    } catch (error) {
        console.log("error: ", error);
        let response = error_function({
            success: false,
            statuscode: 400,
            message: "Error fetching cart items",
        });
        res.status(response.statuscode).send(response);
        return;
    }
};

exports.addWishList = async (req, res) => {
    try {
        const { userId, productId, title, price,} = req.body;

        // Fetch the user
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "User not found!",
            });
        }

        // Fetch the product
        const product = await AddData.findById(productId).lean();
        if (!product) {
            return res.status(404).send({
                success: false,
                statuscode: 404,
                message: "Product not found!",
            });
        }

        // Log current wishlist for debugging
        console.log("Wishlist Before:", user.wishlist);

        // Use atomic operation to avoid race conditions
        const updatedUser = await users.findOneAndUpdate(
            { 
                _id: userId, 
                "wishlist.productId": { $ne: productId }, // Ensure product is not already in wishlist
            },
            { 
                $push: { 
                    wishlist: { 
                        productId, 
                        title: product.title || title, 
                        price: product.price || price, 
                    },
                },
            },
            { new: true } // Return updated user
        );

        // Check if product was added or already exists
        if (!updatedUser) {
            return res.status(400).send({
                success: false,
                statuscode: 400,
                message: "Product already in wishlist!",
            });
        }

        // Log updated wishlist for debugging
        console.log("Wishlist After:", updatedUser.wishlist);

        // Send success response
        return res.status(200).send({
            success: true,
            statuscode: 200,
            data: {
                productId, 
                title: product.title || title, 
                price: product.price || price,
            },
            message: "Item successfully added to the wishlist.",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            success: false,
            statuscode: 500,
            message: "Internal server error",
        });
    }
};

exports.addAddress = async (req, res) => {
    try {
        const { firstName, pincode, flatDetails, streetDetails, landmark, city, state } = req.body;
        const userId = req.params.id;; // Assuming user ID from middleware

        if (!firstName || !pincode || !flatDetails || !streetDetails || !city || !state) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        const newAddress = { firstName, pincode, flatDetails, streetDetails, landmark, city, state };

        const updatedUser = await users.findByIdAndUpdate(
            userId,
            { $push: { address: newAddress } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Address added successfully",
            address: newAddress,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.loadWishList = async (req, res) => {
    try {
        // Extract userId from request (e.g., query parameters, body, or headers)
        const  userId  = req.params.id; // Assuming userId is passed as a query parameter

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Fetch the user's wishlist
        const user = await users.findById(userId, 'wishlist'); // Fetch only the 'wishlist' field

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("Wishlist for user:", user.wishlist);

        // Send response with the user's wishlist
        res.status(200).json({
            success: true,
            message: "Wishlist retrieved successfully",
            data: user.wishlist, // Return only the wishlist
        });
    } catch (error) {
        console.error("Error loading wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load wishlist",
            error: error.message,
        });
    }
};

exports.AddressLoad =async (req, res) => {

    try {
        // Extract userId from request (e.g., query parameters, body, or headers)
        const  userId  = req.params.id; // Assuming userId is passed as a query parameter

        // Validate userId
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Fetch the user's wishlist
        const user = await users.findById(userId, 'address'); // Fetch only the 'wishlist' field

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        console.log("address for user:", user.address);

        // Send response with the user's wishlist
        res.status(200).json({
            success: true,
            message: "address retrieved successfully",
            data: user.address, // Return only the wishlist
        });
    } catch (error) {
        console.error("Error loading wishlist:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load wishlist",
            error: error.message,
        });
    }

}