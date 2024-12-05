const { success_function, error_function } = require('../utli/ResponseHandler');
const admin = require('../db/models/admin');
const user = require('../db/models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;
        console.log("email:", email);
        console.log("password:", password);

        // Check if the email exists in the admin collection
        let adminUser = await admin.findOne({ email }).populate('usertype');
        console.log("adminUser:", adminUser);

        // Check if the email exists in the user collection (if not found in admin)
        let regularUser = null;
        if (!adminUser) {
            regularUser = await user.findOne({ email }).populate('usertype');
            console.log("regularUser:", regularUser);
        }

        let dbUser = adminUser || regularUser;  // Determine if the user is admin or regular

        // If user (either admin or regular) is found
        if (dbUser) {
            const passwordMatch = bcrypt.compareSync(password, dbUser.password);
            console.log("passwordMatch:", passwordMatch);

            if (passwordMatch) {
                const token = jwt.sign(
                    { user_id: dbUser._id },
                    process.env.PRIVATE_KEY,
                    { expiresIn: '10d' }
                );

                const token_data = {
                    token,
                    id: dbUser._id,
                    user_type: dbUser.usertype
                };

                const response = success_function({
                    success: true,
                    statuscode: 200,
                    data: token_data,
                    message: "Successfully logged in."
                });
                return res.status(response.statuscode).send(response);
            } else {
                // If password doesn't match
                const response = error_function({
                    success: false,
                    statuscode: 400,
                    message: "Invalid password."
                });
                return res.status(response.statuscode).send(response);
            }
        } else {
            // If neither admin nor user found
            const response = error_function({
                success: false,
                statuscode: 404,
                message: "User not found."
            });
            return res.status(response.statuscode).send(response);
        }
    } catch (error) {
        console.error("Error:", error);

        const response = error_function({
            success: false,
            statuscode: 500,
            message: "An error occurred during login."
        });
        return res.status(response.statuscode).send(response);
    }
};
