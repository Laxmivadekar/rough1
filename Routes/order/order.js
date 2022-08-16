const { validateRoute } = require("../../Helper/auth")
const { Validator } = require('node-input-validator');
const express = require("express")
const knex = require('../../db/database');
const logger = require('../../Helper/logger');
const users = express.Router();
const br = require('../../Helper/DataModel/baseResponse');

/**
 * @swagger
 * /api/users/get-cafe-review/{cafe_id}:
 *  get:
 *      summery: Get order review by ID
 *      tags: [order]
 *      parameters:
 *      - name: cafe_id
 *        description: Get order review by ID
 *        in: path
 *        default: 1
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: destination not found
 *          default:
 *              description: Default response for this api
 */


users.get('/api/users/get-cafe-review/:cafe_id', validateRoute, (req, res) => {
    try{
        knex.select('o_r.experience_rating','o_r.review_description','u_c_p.first_name','u_c_p.last_name','u_c_p.city','u_c_p.age','u_c_p.profile_pic_image_id')
            .from('order_review as o_r')
            .where('o_r.id',req.params.cafe_id)
            .join('user_customer_profile as u_c_p',{'u_c_p.user_customer_id ':'o_r.user_customer_id'})
            .then((data) => {
                console.log({"data":data});
                if (data.length > 0){
                    br.sendSuccess(res, data , 'Get order review by cafe_id');
                    console.log("Get order review by cafe_id");
                }
                else{
                    res.status(204).send(br.withError("The table have empty data"));
                    console.log("data is empty");
                }
            })
            .catch(err => {
                console.error(err.message);
                br.sendDatabaseError(res, err);
            })

    }catch(err){
        console.error(err.message);
        br.sendDatabaseError(res, err);
    }
})

/**
 * @swagger
 * /api/users/check-order-status/{order_id}:
 *  get:
 *      summery: check order status by ID
 *      tags: [order]
 *      parameters:
 *      - name: order_id
 *        description: check order status
 *        in: path
 *        default: 1
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *          404:
 *              description: destination not found
 *          default:
 *              description: Default response for this api
 */


 users.get('/api/users/check-order-status/:order_id', validateRoute, (req, res) => {
    try{
        knex.select('*')
        .from({order_detail: 'order_detail'})
        .where('order_detail.id',req.params.order_id)
        .join('order_list as o_l', {'o_l.id':'order_detail.id'})
        .then((data) => {
            console.log({"data":data});
            if (data.length > 0){
                br.sendSuccess(res, data , 'successfully Get Order Status by order_id');
                console.log("successfully Get Order Status by order_id ");
            }
            else{
                res.status(400).send(br.withError("The table have empty data"));
                console.log("data is empty");
            }
        })
        .catch(err => {
            console.error(err.message);
            br.sendDatabaseError(res, err);
            })

    }catch(err){
        console.error(err.message);
        br.sendDatabaseError(res, err);
    }
})


/**
 * @swagger
 * /place-order/:
 *  post:
 *      summary: Add new item to Package pricing
 *      tags: [order]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          user_customer_id:
 *                              type: integer
 *                              default: 4
 *                          cafe_list_id:
 *                              type: integer
 *                              default: 1
 *                          cafe_table_id:
 *                              type: integer
 *                              default: 16
 *                          qr_id:
 *                              type: integer
 *                              default: 13
 *                          order_list_id:
 *                              type: integer
 *                              default: 1
 *                          menu_item_price_id:
 *                              type: integer
 *                              default: 1
 *                          menu_addon_price_id:
 *                              type: integer
 *                              default: 1
 *                          status:
 *                              type: integer
 *                              default: 1
 *      responses:
 *          200:
 *              description: Success
 *          default:
 *              description: Default response for this api
 */

 users.post("/place-order/",validateRoute,(req,res) => {
    const v = new Validator(req.body, {
        user_customer_id: 'required|integer',
        cafe_list_id : 'required|integer',
        cafe_table_id: 'required|integer',
        qr_id:'required|integer',

        order_list_id: 'required|integer',
        menu_item_price_id : 'required|integer',
        menu_addon_price_id :'required|integer',
        status:'required|integer'
    });
    // console.log({"v":v});
    v.check().then((matched) => {
        if(!matched){
            console.log(matched);
            res.status(400).send(br.withError('Missed Required files', req.body.errors));}
        else{
            const p1 = new Promise((resolve, reject) => {
                knex('cafe_list')
                .where('id',req.body.cafe_list_id)
                .then(cafeData => {
                            console.log({"p1":cafeData});
                            resolve(cafeData)
                })
              });
              const p2 = new Promise((resolve, reject) => {
                knex('cafe_table')
                .where('id',req.body.cafe_table_id)
                .then(cafeData => {
                    resolve(cafeData)
                })
              });
            
              const p3 = new Promise((resolve, reject) => {
                knex('qr_code')
                .where('id',req.body.qr_id)
                .then(cafeData => {
                    resolve(cafeData)
                })
              });
              const p4 = new Promise((resolve, reject) => {
                knex('user_customer')
                .where('id',req.body.user_customer_id)
                .then(cafeData => {
                            console.log({"p1":cafeData});
                            resolve(cafeData)
                })
              });

              const p5 = new Promise((resolve, reject) => {
                knex('order_list')
                .select('*')
                .insert({user_customer_id:req.body.user_customer_id,cafe_list_id:req.body.cafe_list_id,cafe_table_id:req.body.cafe_table_id,qr_id:req.body.qr_id})
                .then((data)=>{
                    resolve("data submitted successfully order_list...")
                    console.log({"data":"data submitted successfully order_list..."});
                })
              });
              
              const p6 = new Promise((resolve, reject) => {
                knex('order_detail')
                .select('*')
                .insert({order_list_id:req.body.order_list_id,menu_item_price_id :req.body.menu_item_price_id,menu_addon_price_id:req.body.menu_addon_price_id,status:req.body.status})
                .then((data)=>{
                    resolve("data submitted successfully into order_detail...")
                    console.log({"data":"data submitted successfully into order_detail..."});
            })
              });

              // Using .catch:
              Promise.all([p1, p2, p3,p4,p5,p6])
                .then((values) => {
                  console.log({"values":values});
                  br.sendSuccess(res, values , 'getting the whole data from the tables')
                //   res.send({"value":values})
                })
                .catch((error) => {
                  console.error(error.message)
                  br.sendServerError(res, error.message);
                });
        }
        })
})


module.exports = users;