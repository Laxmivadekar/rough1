const { validateRoute } = require('../../Helper/auth')
const express = require("express")
const knex = require('../../db/database');
const logger = require('../../Helper/logger');
const users = express.Router();
const br = require('../../Helper/DataModel/baseResponse');



/**
 * @swagger
 * /api/users/get-most-viewed:
 *  get:
 *      summary: get-most-viewed
 *      description: Most Viewed Restautants in that area
 *      tags: [cafe_list]
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
 users.get('/api/users/get-most-viewed', validateRoute, (req, res) => {
    try{
        knex.select('cafe_list.id', 'cafe_list.name', 'cafe_list.city', 'cafe_details.rating','cafe_details.logo_image_id','cafe_details.is_most_visited')
            .from({cafe_details: 'cafe_details'})
            .where({is_most_visited : 1})
            .join('cafe_list as cafe_list', {'cafe_details.cafe_list_id':'cafe_list.id'})
            .then((data) => {
                console.log("data",data)
                if (data.length > 0){
                    const decendByRating = data.sort((a,b) => {
                        return b.rating - a.rating ;
                    })
                    br.sendSuccess(res, decendByRating , 'most views through rating');
                    console.log("most views through rating successfully fetched");
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
 * /api/users/get-newly-res:
 *  get:
 *      summary: Get Cafe details
 *      description: get-cafe-deatils
 *      tags: [cafe_list]
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

 users.get('/api/users/get-newly-res', validateRoute, (req, res) => {
    try{
        knex.select('c.id', 'c.name', 'c.city', 'cafe_details.logo_image_id ','cafe_details.is_new_opening','cafe_details.rating')
            .from({cafe_details: 'cafe_details'})
            .where({is_new_opening : 1})
            .orderBy('rating', 'asc')
            .join('cafe_list as c', {'cafe_details.cafe_list_id':'c.id'})
            .then((data) => {
                console.log({"data":data});
                if (data.length > 0){
                    // const ascendByRating = data.sort((a,b) => {
                    //     return a.rating - b.rating ;
                    // })
                    br.sendSuccess(res, data , 'Get Restaurants Newly Opened in that area');
                    console.log("Get Restaurants Newly Opened in that area");
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
 * /api/users/get-featured-cafe:
 *  get:
 *      summary: get-featured-cafe
 *      description: Get Featured Cafe
 *      tags: [cafe_list]
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
 users.get('/api/users/get-featured-cafe', validateRoute, (req, res) => {
    try{
        knex.select('cafe_list.id', 'cafe_list.name', 'cafe_list.city', 'cafe_details.rating', 'cafe_details.logo_image_id','cafe_details.price_range','cafe_details.is_featured')
            .from({cafe_details: 'cafe_details'})
            .where({is_featured : 1})
            .join('cafe_list as cafe_list', {'cafe_details.cafe_list_id':'cafe_list.id'})
            // .join('cafe_contact_data as cafe_contact_data', {'cafe_list.id': 'cafe_contact_data.cafe_list_id'} )
            .then((data) => {
                console.log({"data":data});
                if (data.length > 0){
                    br.sendSuccess(res, data , 'Get Featured Cafe');
                    console.log("Get Featured Cafe");
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
 * /api/users/get-most-ordered-items:
 *  get:
 *      summary: get-most-viewed
 *      description: Most Viewed Restautants in that area
 *      tags: [cafe_list]
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
 users.get('/api/users/get-most-ordered-items', validateRoute, (req, res) => {
    try{
        knex.select('cafe_list.id', 'cafe_list.name', 'cafe_list.city', 'cafe_details.rating','cafe_details.logo_image_id','cafe_details.is_most_visited','cafe_details.total_orders')
            .from({cafe_details: 'cafe_details'})
            .orderBy('total_orders', 'desc')
            .join('cafe_list as cafe_list', {'cafe_details.cafe_list_id':'cafe_list.id'})
            .then((data) => {
                console.log("data",data)
                if (data.length > 0){
                    // const decendByRating = data.sort((a,b) => {
                    //     return b.rating - a.rating ;
                    // })
                    br.sendSuccess(res, data , 'successfully get most ordered items');
                    console.log("successfully get most ordered items");
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
 * /api/users/get-cafe-images/{cafe_id}:
 *  get:
 *      summery: Get cafe image by ID
 *      tags: [cafe_list]
 *      parameters:
 *      - name: cafe_id
 *        description: cafe image Id
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


 users.get('/api/users/get-cafe-images/:cafe_id', validateRoute, (req, res) => {
    try{
        knex.select('server_image_id')
            .table('cafe_gallery')
            .where({'id':req.params.cafe_id})
            .then((data) => {
                console.log({"data":data});
                if (data.length > 0){
                    br.sendSuccess(res, data , 'Get Cafe Images by cafe_id');
                    console.log("Get Cafe Images by cafe_id ");
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
 * /api/users/get-cafe-details/{cafe_id}:
 *  get:
 *      summary: Get cafe details
 *      tags: [cafe_list]
 *      parameters:
 *      - name: cafe_id
 *        in: path
 *        required: true
 *        default: 1
 *      responses:
 *          200:
 *              description: Success
 *          default:
 *              description: Default response for this api
 */
 users.get('/api/users/get-cafe-details/:cafe_id', validateRoute, (req, res) => {
    try{
        knex.select('*')
            .from({cafe_details: 'cafe_details'})
            .where({'cafe_details.id':req.params.cafe_id})
            .join('cafe_list as cafe_list', {'cafe_details.cafe_list_id':'cafe_list.id'})
            .then((data) => {
                if (data.length > 0){
                    br.sendSuccess(res, data , 'successfully Get cafe details');
                    console.log("successfully Get cafe details");
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


module.exports = users;