require('dotenv').config();
const knex = require('knex');

console.log(process.env.DB_HOST)
console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME)

module.exports = knex({
    client : "mysql",
    connection : {
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    }
});
