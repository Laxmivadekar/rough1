require('dotenv').config();
const express = require('express');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const path = require('path');
const cors = require('cors');
const logger = require('./Helper/logger');
const app = express();

/**
 * @swagger
 * components:
 *  schemas:
 *      SuccessResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *              msg:
 *                  type: string
 *                  default: ''
 *              data:
 *                  type: object
 *      ErrorResponse:
 *          type: object
 *          properties:
 *              success:
 *                  type: boolean
 *              msg:
 *                  type: string
 *              errors:
 *                  type: object
 */

console.log(process.env.PORT);

const specs = swaggerJsDoc({
    definition: {
        openapi : "3.0.0",
        info: {
            title: "Eats Mobile API",
            version: "1.0.0",
            description: "Eats Mobile api"
        },
        components: {
            securitySchemes:{
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
        servers: [
            {
                url: "http://localhost:" + process.env.PORT,
                description: 'Dev Server'
            },
            {
                url: "https://m.app-stage.a2deats.com",
                description: 'Staging Server'
            },
            {
                url: "https://m.app-prod.a2deats.com",
                description: 'Production Server'
            }
        ],
    },
    apis: [
        "./index.js",
        "./Routes/*.js",
        "./Routes/*/*.js",
        "./Routes/*/*/*.js",
        // "./Routes/cafe/*.js",
        // "./Routes/menuCatery/*.js",
        // "./Routes/order/*.js"
        // "./Routes/*/*/*.js"
    ]
});


// app.use(app.router);
// routes.initialize(app);


//parse raw json data
app.use(express.json({extended:false}));


// parse form data
app.use(express.urlencoded({ extended: true }));

//allow cors
app.use(cors());

//console out all the apis request
app.use( (req, res, next) => {
    if(req.path.includes('/api/')){
        logger.info('Request Type: ' + req.method + ' Path:' + res.req.path);
    }
    next();
});

//setup swagger UI
if(process.env.IS_PROD !== '1') {
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

app.use('/', require('./Routes/users'));
app.use('/', require('./Routes/userProfile'));

// app.use("/",require('./Routes/profile'))
// app.use("/",require('./Routes/placeorder'))

app.use('/', require('./Routes/cafe/cafe'));
app.use('/', require('./Routes/menuCategory/menuCategory'));
app.use('/', require('./Routes/order/order'));


app.use(express.static(path.join(__dirname + '\/Public', './')));

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Server is running on this port no ${port}`);
});