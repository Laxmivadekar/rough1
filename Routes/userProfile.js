const { validateRoute } = require('../Helper/auth')
const { Validator } = require('node-input-validator');
const express = require("express")
const knex = require('../db/database');
const logger = require('../Helper/logger');
const users = express.Router();
const br = require('../Helper/DataModel/baseResponse');

/**
 * @swagger
 * /api/users/profile:
 *  post:
 *      summary: Create the profile
 *      description: create for particular user
 *      tags: [UserProfile]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          firstName:
 *                              type: string
 *                              default: " "
 *                          lastName:
 *                              type: string
 *                              default: " "
 *                          userCustomerId:
 *                              type: number
 *                              default: 3
 *                          city:
 *                              type: string
 *                              default: " "
 *                          profile_pic_image_id:
 *                              type: string
 *                              default: " "
 *                          email:
 *                              type: string
 *                              default: " "
 *                          mobile_number:
 *                              type: string
 *                              default: " "
 *      responses:
 *          200:
 *              description: Success
 *          default:
 *              description: Default response for this api
 */

 users.post("/api/users/profile",validateRoute,(req,res) => {
    const v = new Validator(req.body, {
        firstName: 'required|string',
        lastName: 'required|string',
        userCustomerId: 'required|integer',
        city: 'required|string',
        email: 'required|string',
        profile_pic_image_id:'required|string',
        mobile_number:'required|string'
    });
    v.check().then((matched) => {
        if(!matched){
            res.status(422).send(br.withError('Missed Required files', req.body.errors));
        }else{
            var {firstName,lastName,userCustomerId,city,email,profile_pic_image_id,mobile_number} = req.body;

            const p1 = new Promise((resolve, reject) => {
                knex('user_customer')
                .where('mobile_number', mobile_number)
                .then((users) => {
                    console.log("users",users);
                    console.log("users data",users.length);
                    if(users.length>0){
                        knex('user_customer')
                        .where('mobile_number', mobile_number)
                        .update({email:email})
                        .then((data)=>{
                            resolve("email updated successfully into the database...")
                            console.log("email updated successfully into the database...");
                        })}
                    else{
                        knex('user_customer')
                        .where('mobile_number', mobile_number)
                        .insert({mobile_number:mobile_number,email:email,user_role_id:2})
                        .then((data)=>{
                            resolve(data)
                            console.log("mobile number inserted successfully into the database...");
                        }) 
                    }
            })
            })
            
        
           const p2 = new Promise((resolve, reject) => {
                knex('user_customer_profile')
                .insert({first_name:firstName,last_name:lastName,user_customer_id :userCustomerId,
                    city:city,profile_pic_image_id:profile_pic_image_id})
                .then(data =>{
                    resolve("profile submitted successfully into the database...")
                    console.log("profile submitted successfully into the database...");
                })
            });

            Promise.all([p1, p2])
                .then((values) => {
                    console.log({"values":values});
                    br.sendSuccess(res, values , 'getting the whole data from the tables')
                })
                .catch((error) => {
                    console.error(error.message)
                    br.sendServerError(res, error.message);
                });
        }
    })
            
})
/**
 * @swagger
 * /api/users/getProfile/{id}:
 *   get:
 *     summary: Get all Profiles by id
 *     tags: [UserProfile]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Get profile by ID
 *     responses:
 *       200:
 *         description: The profile description by id
 *         contents:
 *           application/json:
 *       404:
 *          description: The profile was not found
 *          
 */


users.get("/api/users/getProfile/:id",validateRoute,(req,res) => {
    const id = req.params;
    knex.select('*')
        .from('user_customer_profile')
        .where({id : req.params.id})
        .then((data) => {
            // console.log(data);
            if(data.length > 0){
                br.sendSuccess(res, data , 'getting the profile by id')
                // res.status(200).send(br.withSuccess("Profile Details", data[0]))
                console.log("data",data[0]);
            }else{
                res.status(204).send(br.withError("Profile not found"));
                console.log("Profile not found");
            }
        }).catch((err) => {
            res.status(500).send(err.message)
            console.log(err.message);
        })
})

/**
 * @swagger
 * /api/users/updateProfile/{id}:
 *  put:
 *    summary: Update the Profile by its ID
 *    tags: [UserProfile]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The Profile update by id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *                firstName:
 *                    type: string
 *                    default: " "
 *                lastName:
 *                    type: string
 *                    default: " "
 *                userCustomerId:
 *                    type: number
 *                    default: 1
 *                city:
 *                    type: string
 *                    default: " "
 *                gender:
 *                    type: string
 *                    default: " "
 *                email:
 *                    type: string
 *                    default: " "
 *    responses:
 *      200:
 *        description: The Profile was updated
 *        content:
 *          application/json:/api/users/updateProfile
 *      404:
 *        description: The profile was not found 
 *      default:
 *        description: Default response for this api
 */


users.put("/api/users/updateProfile/:id",validateRoute,(req,res) => {
    try{
        // var id = req.params;
        var {firstName,lastName,userCustomerId,city,profile_pic_image_id,email} = req.body;
        knex.select('*')
        .from('user_customer_profile')
        .where({id : req.params.id})
        .then((users) => {
            console.log("users from database", users);
            if (users.length>0){
                knex('user_customer_profile')
                .where({id: req.params.id})
                .update({user_customer_id:userCustomerId,first_name:firstName,last_name:lastName,gender:gender,email:email,city:city,profile_pic_image_id:profile_pic_image_id})
                .then(user => {
                    console.log("users",user);
                    br.sendSuccess(res, req.body , 'profile updated successfully')
                })
                .catch((err) => {
                    console.error(err);
                    res.send({"err.message":err.message})
                })
            }
            else{
                res.status(400).send(br.withError("all fields are required"));
                console.log("all fields are required");
            }
        })
        .catch((err) => {
            console.error(err.message);
            console.error(err);
        });
    }catch(err){
        console.error(err);
    }
})


users.get("/api/users/get-user-profile/:id",validateRoute,(req,res) => {
    const id = req.params;
    knex.select('user_customer.id','user_customer.mobile_number' ,'user_customer_profile.first_name', 'user_customer_profile.email', 'user_customer_profile.age', 'user_customer_profile.gender','user_customer_profile.city')
            .from({user_customer_profile:'user_customer_profile'})
            // .from({user_customer: 'user_customer'})
            // .where({id: req.params.id})
            .join('user_customer as user_customer', {'user_customer_profile.id':'user_customer.id'})
        .then((data) => {
            // console.log(data);
            if(data.length > 0){
                br.sendSuccess(res, data , 'getting the user profile by id')
                console.log("data",data[0]);
            }else{
                res.status(422).send(br.withError("Profile not found"));
                console.log("Profile not found");
            }
        }).catch((err) => {
            res.status(500).send(err.message)
            console.log(err.message);
        })
})


module.exports = users;