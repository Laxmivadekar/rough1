const { validateRoute } = require('../../Helper/auth')
const express = require("express")
const knex = require('../../db/database');
const logger = require('../../Helper/logger');
const users = express.Router();
const br = require('../../Helper/DataModel/baseResponse');

/**
 * @swagger
 * /api/users/get-food-category/:
 *  get:
 *      summary: get-cafe-details
 *      description: All food category Details
 *      tags: [menu]
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

users.get("/api/users/get-food-category/",validateRoute,(req,res) => {
    knex.select('*')
        .table('menu_item_price')
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).send(br.withSuccess("All food category Details", data))
                console.log(data[0]);
            }else{
                res.status(204).send(br.withError("The table dont have any data"));
                console.log("empty table is there, please insert the data then you will get that data back");
            }
        }).catch((err) => {
            res.status(500).send(err.message)
            console.log(err.message);
        })
})

/**
 * @swagger
 * /api/users/get-food-items/{cafe-id}:
 *  get:
 *      summary: All food category Details by id
 *      tags: [menu]
 *      parameters:
 *      - name: cafe-id
 *        in: path
 *        required: true
 *        default: 1
 *      responses:
 *          200:
 *              description: Success
 *          default:
 *              description: Default response for this api
 */
 users.get("/api/users/get-food-items/:category_id",validateRoute,(req,res) => {
    // const category_id = req.params;
    try{
        knex('menu_item_price as m_i_p').where({
            'm_i_p.cafe_list_id': req.params.category_id,
            'm_i_p.status':  1
          }).select('*')
        .join('menu_addon as m_a',{'m_a.id':'m_i_p.menu_addon_id'})
        .join('menu_item as m_i',{'m_i.id ':'m_i_p.menu_item_id'})
        .then((data) => {
            console.log(data);
            if(data.length > 0){
                res.status(200).send(br.withSuccess("All food category Details", data))
                console.log(data[0]);
            }else{
                br.sendDatabaseError(res,"The table dont have any data")
                console.log("empty table is there, please insert the data then you will get that data back");
            }
        }).catch((err) => {
            console.error({"error":err});
            res.status(500).send(err.message)
            console.log(err.message);
        })
    }catch(err){
        console.error(err);
        res.status(500).send(err.message)
        console.log(err.message);
    }
})

/**
 * @swagger
 * /api/users/search/{cafename}/{menuname}:
 *  get:
 *      summary: Get search by name
 *      tags: [menu]
 *      parameters:
 *      - name: cafename
 *        in: path
 *        description: cafe_list name
 *        default: ""
 *        required: true
 *      - name: menuname
 *        in: path
 *        description: menu_item name
 *        default: ""
 *        required: true
 *      responses:
 *          200:
 *              description: Success
 *          default:
 *              description: Default response for this api
 */

 users.get('/api/users/search/:cafename/:menuname', validateRoute, (req, res) => {
    try{
        console.log(req.query);
        console.log(req.params.cafename);
        console.log(req.params.menuname);
        const cafename = req.params.cafename,menuname = req.params.menuname;

        knex('cafe_list as c_l')
        .where('c_l.name', 'like', `%${cafename}%`)
        .where('m_i.name', 'like', `%${menuname}%`)
        .join('menu_item as m_i')
        .then((data) => {
            console.log({"data":data});
            if(data.length>0){
                // const info = data
                // console.log(info[0].name);
                res.status(200).send({"data":data})
            }
            else{
                console.log({"data":"some data is missing in the table"});
                res.status(422).send({"data":"some data is missing in the table"})
            }
        })
        .catch(err=>{
            res.send({"error":err.message})
            console.error(err);
        })
    }catch(err){
        console.error(err.message);
        res.status(500).send(err.message)
    }
})


module.exports = users;