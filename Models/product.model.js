const slugify = require('slugify'); 
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        slug: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.DECIMAL(20, 2),
            allowNull: false,
        },

        stock: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date(),
            field: 'updated_at'
        },
    }, {
        timestamps: false,
        tableName: 'products',
        indexes: [
            {fields: ['slug']},
        ],
        hooks: {
            beforeValidate: function (product, options) {
                product.slug = slugify(product.name, {lower: true});
            }
        }
    });


    Product.associate = (models) => {
        /* // Produc.scope('withImages').findAll().then()
        Product.addScope('withImages', {
            include: [{
                required: false,
                model: models.ProductImage,
                as: 'images',
                attributes: ['id', 'filePath'],
            }]
        });
        */

        // here is how we add defaultScope programmatically
        Product.addScope('defaultScope', {
                include: [{
                    required: false,
                    model: models.ProductImage,
                    as: 'images',
                    attributes: ['id', 'filePath'],
                }]
            },
            {// defaultScope already exists, to avoid the error pass override
                override: true,
            });

        Product.hasMany(models.Comment);
        Product.hasMany(models.ProductImage, {as: 'images'});
        // Product.hasMany(models.ProductCategory);
        Product.belongsToMany(models.Category, {
            through: models.ProductCategory,
            foreignKey: 'productId',
            otherKey: 'categoryId',
        });

        // Product.hasMany(models.ProductTag);
        Product.belongsToMany(models.Tag, {
            through: models.ProductTag,
            foreignKey: 'productId',
            otherKey: 'tagId'
        });

    };

    Product.beforeBulkUpdate(product => {
        product.attributes.updateTime = new Date();
        return product;
    });

    return Product;
};