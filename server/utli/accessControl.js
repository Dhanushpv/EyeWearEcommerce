const success_function = require('../utli/ResponseHandler').success_function;
const error_function = require('../utli/ResponseHandler').error_function;
const users = require('../db/models/user');
const usertype = require('../db/models/usertypes');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();
let control_data =require('../utli/controldata.json')

exports.accessControl = async function (access_types, req, res, next) {
    try {
        console.log("access_types", access_types);
        

        if (access_types === '*') {
            next();
        } else {

            const authHeader = req.headers["authorization"];
            console.log("authHeader : ", authHeader);

            if (!authHeader) {
                let response = error_function({
                    statuscode: 400,
                    message: "Please login to continue",
                });
                res.status(response.statuscode).send(response);
                return;
            }

            const token = authHeader.split(" ")[1];
            console.log("token : ", token);


            if (!token || token === "null" || token === "undefined") {
                let response = error_function({
                    statuscode: 400,
                    message: "Invalid access token",
                });
                res.status(response.statuscode).send(response);
                return;
            } else {

                jwt.verify(token, process.env.PRIVATE_KEY, async function (err, decoded) {
                    if (err) {
                        let response = error_function({
                            statuscode: 400,
                            message: err.message ? err.message : "Authentication Failed",
                        });
                        res.status(response.statuscode).send(response);
                        return;
                    } else {
                        console.log("decoded :", decoded);
                
                        let user = await users.findOne({ _id: decoded.user_id }).populate('usertype');
                        console.log("user", user);
                
                        if (!user) {
                            let response = error_function({
                                statuscode: 404,
                                message: "User not found",
                            });
                            res.status(response.statuscode).send(response);
                            return;
                        }
                
                        if (!user.usertype) {
                            let response = error_function({
                                statuscode: 404,
                                message: "User type not found",
                            });
                            res.status(response.statuscode).send(response);
                            return;
                        }
                
                        let user_type = user.usertype.user_type;
                        console.log("user_type", user_type);
                
                        let allowed = access_types.split(" ").map((obj) => control_data[obj]);
                        console.log("allowed", allowed);
                
                        if (allowed && allowed.includes(user_type)) {
                            next();
                        } else {
                            let response = error_function({
                                statuscode: 400,
                                message: "Not allowed to access the route",
                            });
                            res.status(response.statuscode).send(response);
                            return;
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.log("error : ", error);
        let response = error_function({
            statuscode: 500,
            message: "Internal Server Error",
        });
        res.status(response.statuscode).send(response);
    }
};