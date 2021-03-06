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
db.User = require('../models/user.model')(sequelize, Sequelize);
db.UserRole = require('../models/user_role.model')(sequelize, Sequelize);
db.Role = require('../models/role.model')(sequelize, Sequelize);

db.Address = require('../models/address.model')(sequelize, Sequelize);
db.Product = require('../models/product.model')(sequelize, Sequelize);
db.Comment = require('../models/comment.model')(sequelize, Sequelize);


db.Order = require('../models/order.model')(sequelize, Sequelize);
db.OrderItem = require('../models/order_item.model')(sequelize, Sequelize);

db.FileUpload = require('../models/file_upload.model')(sequelize, Sequelize);
db.ProductImage = require('../models/product_image.model')(sequelize, Sequelize);

db.Tag = require('../models/tag.model')(sequelize, Sequelize);
db.ProductTag = require('../models/product_tag.model')(sequelize, Sequelize);
db.TagImage = require('../models/tag_image.model')(sequelize, Sequelize);

db.Category = require('../models/category.model')(sequelize, Sequelize);
db.ProductCategory = require('../models/product_category.model')(sequelize, Sequelize);
db.CategoryImage = require('../models/category_image.model')(sequelize, Sequelize);

db.User.associate(db);
db.Role.associate(db);
db.UserRole.associate(db);

db.Address.associate(db);

db.Tag.associate(db);
db.Category.associate(db);

db.FileUpload.associate(db);
db.CategoryImage.associate(db);
db.TagImage.associate(db);
db.ProductImage.associate(db);

db.Product.associate(db);
db.Comment.associate(db);

db.Order.associate(db);
db.OrderItem.associate(db);



module.exports = db