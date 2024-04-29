const express = require('express');
const router = express.Router();
const { MenuItem, Feedback, Cart, UserItem, Seller, User } = require('../Modals/models');
const multer = require("multer");
 
const path = require('path');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = file.mimetype.split("/")[0];
    const dir = path.join(__dirname, 'uploads', ext === "image" ? 'images' : 'others');
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

const upload = multer({ storage: multerStorage });


router.get('/menu/:sellerName', async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({ where: { sellerName: req.params.sellerName } });
    if(menuItems == []) throw new Error("No menu items set!")
    res.status(201).json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/menu', upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, sellerName } = req.body;
    const imgSrc = req.file.filename;
    console.log("imageSrc : " + imgSrc)
    const initial = await MenuItem.findOne({ where: { name: name, sellerName: sellerName , description : description} })
    if (initial == null) {
      const newMenuItem = await MenuItem.create({ name, price, description, image : imgSrc, sellerName });
      res.status(201).json(newMenuItem);
    } else {
      throw new Error(`Menu item with name ${name} already exists!`)
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/feedback/:sellerName', async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ where: { adminName: req.params.sellerName } });
    if(feedbacks == []) throw new Error("No feedbacks recieved yet!")
    res.status(201).json(feedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
      const carts = await Cart.findAll({ where: { SellerId: req.params.id, isPlaced: 1 , isFinished : 0 } });
      if (carts == []) throw Error("No orders by the users yet");
      const ans = await Promise.all(carts.map(async (cart) => {
          const cartId = cart.id
          const items = await UserItem.findAll({ where: { adminName: cart.adminName, CartId: cartId } });
          const data = { items: items, total: cart.total, username: cart.username, id: cartId }
          return data
      }));
      res.status(201).json(ans)
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});

router.get('/users/:sellerName', async (req, res) => {
  try {
      const carts = await Cart.findAll({ where: { adminName: req.params.sellerName, isPlaced : 1 } ,  paranoid: false });
      console.log(carts)
      if (carts == []) throw Error("No orders by the users yet");
      const ans = await Promise.all(carts.map(async (cart) => {
          const username = cart.username
          const email = await User.findOne({where : {name : username} })
          const data = { username: cart.username, email : email.email , id: cart.id }
          return data
      }));      
      const uniqueUsers = ans.reduce((unique, user) => {
        if (!unique.find(u => u.username === user.username)) {
          unique.push(user);
        }
        return unique;
      }, []);
      console.log(uniqueUsers)
      res.status(201).json(uniqueUsers)
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
});

router.delete('/deleteMenuItem', async (req, res) => {
  try {
    const { sellerName, itemName, description } = req.body;
    const data = await MenuItem.findOne({ where: { sellerName: sellerName, name: itemName , description : description  } })
    if (data == null) throw new Error(`Menu item with name ${itemName} not found!`)
    else {
      const deletedMenuItem = await MenuItem.findOne({ where: { sellerName: sellerName, name: itemName , description : description } })
      const rowsAffected = await MenuItem.destroy({ where: { sellerName: sellerName, name: itemName , description : description } })
      res.status(201).json(deletedMenuItem)
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
})

router.post('/updateMenuItem', async (req, res) => {
  try {
    const { sellerName, itemName, price } = req.body;
    const data = await MenuItem.findOne({ where: { sellerName: sellerName, name: itemName } })
    if (data == null) throw new Error(`Menu item with name ${itemName} not found!`)
    else {
      const rowsAffected = await MenuItem.update({ price: price }, { where: { sellerName: sellerName, name: itemName } })
      const updatedMenuItem = await MenuItem.findOne({ where: { sellerName: sellerName, name: itemName } })
      res.status(201).json(updatedMenuItem)
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ errmessage: error.messageor });
  }
})

router.delete('/deleteOrder', async (req, res) => {
  try {
      const { username, sellerName } = req.body;
      const seller = await Seller.findOne({ where: { name: sellerName } })
      if (seller == null) throw new Error(`Seller with name ${sellerName} not found`)
      const sellerId = seller.id;
      const data = await Cart.findOne({ where: { SellerId: sellerId, username: username, isPlaced: 1 , isFinished : 0 } })
      if (data == null) throw new Error(`Order by ${username} not found`)
          const cartId = data.id;
          const rowsAffected2 = await UserItem.destroy({where : {CartId : cartId}});
          const rowsAffected = await Cart.update({isFinished : 1 }, {where : {username : username , adminName : sellerName , isPlaced : 1 , id : cartId}})
          const updatedCartOrder = await Cart.findOne({where : {username : username , adminName : sellerName ,isPlaced : 1 , isFinished : 1 , id : cartId}})
          const rowsAffected1 = await Cart.destroy({ where: { username: username, adminName: sellerName, isPlaced: 1 , isFinished : 1, id : cartId } })
          res.status(201).json(updatedCartOrder)
  }
  catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
  }
})

module.exports = router;