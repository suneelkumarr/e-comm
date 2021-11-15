const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize("e-comm", 'root','',{
    host: 'localhost',
    dialect: 'mysql',
    pool:{max:5, min:0, idle:10000}
});
sequelize.authenticate()
.then(()=>{
    console.log("connected");
}).catch(err => {
    console.log("error: " + err);
})


const db= {}

db.Sequelize = sequelize;
db.sequelize = sequelize;

//models
db.user = require('../model/user')(sequelize, DataTypes);


module.exports = db