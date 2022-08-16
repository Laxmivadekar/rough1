const bcrypt = require('bcrypt');

exports.seed = knex => {
    return knex("user").del().then(()=>{
       return knex("user").insert([{
           id: 1,
           user_name: "Admin",
           user_email: "admin@admin.com",
           user_password: bcrypt.hashSync('admin',10)
       }]);
    });
}