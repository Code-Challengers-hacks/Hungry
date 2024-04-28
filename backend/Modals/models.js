const { DataTypes, Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'mysql',
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'food_ordering_system',
    host: 'localhost'
  });
  

const MenuItem = sequelize.define('MenuItem', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    sellerName: DataTypes.STRING
}, {paranoid : true});

const Feedback = sequelize.define('Feedback', {
    feedback: DataTypes.TEXT,
    username: DataTypes.STRING,
    adminName: DataTypes.STRING,
    rating: DataTypes.FLOAT
});

const UserItem = sequelize.define('UserItem', {
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    adminName: DataTypes.STRING
} , {paranoid : true});

const Seller = sequelize.define('Seller', {
    name: DataTypes.STRING,
    email : DataTypes.TEXT,
    password : DataTypes.TEXT
});

const Cart = sequelize.define('Cart', {
    total: DataTypes.FLOAT,
    username: DataTypes.STRING,
    adminName: DataTypes.STRING,
    isPlaced : {
        type : DataTypes.INTEGER,
        defaultValue: 0
    },
    isFinished : {
        type : DataTypes.INTEGER,
        defaultValue : 0
    }
} , {paranoid : true});

const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email : DataTypes.TEXT,
    password : DataTypes.TEXT
});

MenuItem.belongsTo(Seller);
Seller.hasMany(MenuItem);

Feedback.belongsTo(User);
User.hasMany(Feedback);

UserItem.belongsTo(Cart);
Cart.hasMany(UserItem);

User.hasMany(Cart, { as: 'orderHistory' });
Cart.belongsTo(User);

User.hasMany(Cart);
Cart.belongsTo(User);

Seller.hasMany(Cart, { as: 'orders' });
Cart.belongsTo(Seller);

module.exports = {
    MenuItem,
    UserItem,
    Cart,
    Seller,
    User,
    Feedback,
    sequelize
}