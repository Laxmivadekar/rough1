const { generateToken, validateRoute } = require('../Helper/auth')
const express = require("express")
const bcrypt = require('bcrypt');
const knex = require('../db/database');
const logger = require('../Helper/logger');
const users = express.Router();
const sendOtp = require('../Helper/sendOtp');
const br = require('../Helper/DataModel/baseResponse');
const helper = require('../Helper/helper');

/**
 * @swagger
 * /api/users/gen-otp:
 *  post:
 *      summary: Generate Mobile Otp
 *      description: Generate otp for provided mobile number
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          mobile:
 *                              type: string
 *                              default: 1234567890
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SuccessResponse'
 *          default:
 *              description: Default response for this api
 */
users.post('/api/users/gen-otp', (req, res) => {
    try{

        if(req.body.mobile !== undefined && parseInt(req.body.mobile) > 0 && req.body.mobile.length === 10){
            let mobile = req.body.mobile;

            knex('user_customer')
                .where('mobile_number', mobile)
                .then((users) => {
                    let otp = helper.generateOTP();

                    sendOtp(mobile, otp, (data) => {
                        //we are able to send otp

                        if(users.length > 0){
                            //there is some user with the same input mobile number
                            knex('user_customer').update({
                                otp: otp
                            }).where('id', users[0].id)
                                .then((userData) => {
                                //we have inserted the data
                                //we can send user to check there mobile for otp
                                br.sendSuccess(res, userData, 'Please check your mobile for otp!');
                            }).catch((e)=>{
                                br.sendDatabaseError(res, e);
                            });
                        }else{
                            //there is not user with same mobile number
                            knex('user_customer').insert({
                                user_role_id: 2,
                                mobile_number: mobile,
                                otp: otp,
                                status: 1
                            }).then((userData) => {
                                //we have inserted the data
                                //we can send user to check there mobile for otp
                                br.sendSuccess(res, userData, 'Please check your mobile for otp!');
                            }).catch((e)=>{
                                br.sendDatabaseError(res, e);
                            })
                        }
                    });
                    //br.sendSuccess(res, {});
                })
                .catch((e)=>{
                    br.sendDatabaseError(res, e);
                })
        }else{
            br.sendError(res, {}, 'Please enter a valid mobile number!');
        }
    }catch (e) {
        logger.log(e);
        br.sendServerError(res, e);
    }
})


/**
 * @swagger
 * /api/users/signup:
 *  post:
 *      summary: Mobile User signup
 *      description: signup user using mobile number
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          mobile:
 *                              type: string
 *                              default: 1234567890
 *                          otp:
 *                              type: string
 *                              default: 123456
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SuccessResponse'
 *          default:
 *              description: Default response for this api
 */
 users.post('/api/users/signup', (req, res) => {
    try{
        if(req.body.mobile !== undefined
            && req.body.otp !== undefined && req.body.mobile.length===10 && req.body.otp.length===6 ){
            let mobile = req.body.mobile;
            let otp = req.body.otp;
            knex('user_customer')
            .where('mobile_number', mobile)
            .then((users) => {
                console.log("users length: ",users.length,users.length<1);
                console.log("users: ",users);
                if (users.length<1){
                    br.sendDatabaseError(res,{},"data not found in database")
                    console.log("data not found in database");
                }
                else{
                    if (otp.toString() === (users[0].otp).toString()){
                        console.log({userId: users[0].id});
                        console.log("generateToken",generateToken({userId: users[0].id}));
                        let Token = generateToken({userId: users[0].id});
                        
                        knex('user_customer')
                        .where('mobile_number', mobile)
                        .update({token:Token})
                        .then((data)=>{
                            console.log("token updated in database successfully",data);
                            br.sendSuccess(res, {"token":Token}, 'Token updated successfully...');
                            // res.send({"token":Token})
                        })
                        .catch(err => {
                            console.error(err.message);
                            br.sendError(res, {}, err.message);
                        })
                    }else{
                        br.sendError(res,{},"OTP is wrong,please try right OTP")
                        console.log("OTP is wrong,please try right OTP");
                    }  
                }
            })
        }
        else{
            br.sendError(res, {}, "All fields are required,and it should be correct");
            console.log("All fields are required,and it should be correct");
        }
    }catch(e) {
        br.sendServerError(res, e.message);
        console.error(e.message);
    }
})


/**
 * @swagger
 * /api/users/login:
 *  post:
 *      summary: Mobile Login
 *      description: login user using mobile number and otp
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          mobile:
 *                              type: string
 *                              default: 1234567890
 *                          otp:
 *                              type: string
 *                              default: 123456
 *      responses:
 *          200:
 *              description: Success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SuccessResponse'
 *          default:
 *              description: Default response for this api
 */
users.post('/api/users/login', (req, res) => {
    try{
        if(req.body.mobile !== undefined
            && req.body.otp !== undefined && req.body.mobile.length===10 && req.body.otp.length===6 ){
            let mobile = req.body.mobile;
            let otp = req.body.otp;
            knex('user_customer')
            .where('mobile_number', mobile)
            .then((users) => {
                console.log("users length: ",users.length,users.length<1);
                console.log("users: ",users);
                if (users.length<1){
                    br.sendDatabaseError(res,{},"data not found in database")
                    console.log("data not found in database");
                }
                else{
                    if (otp === (users[0].otp).toString()){
                        console.log({userId: users[0].id});
                        console.log("generateToken",generateToken({userId: users[0].id}));
                        let Token = generateToken({userId: users[0].id});
                        
                        knex('user_customer')
                        .where('mobile_number', mobile)
                        .update({token:Token})
                        .then((data)=>{
                            console.log("token updated in database successfully",data);
                            br.sendSuccess(res, {"token":Token}, 'Token updated successfully...');
                            // res.send({"token":Token})
                        })
                        .catch(err => {
                            console.error(err.message);
                            br.sendError(res, {}, err.message);
                        })
                    }else{
                        br.sendError(res,{},"OTP is wrong,please try right OTP")
                        console.log("OTP is wrong,please try right OTP");
                    }  
                }
            })
        }
        else{
            br.sendError(res, {}, "All fields are required,and it should be correct");
            console.log("All fields are required,and it should be correct");
        }
    }catch(e) {
        br.sendServerError(res, e.message);
        console.error(e.message);
    }
});

module.exports = users;