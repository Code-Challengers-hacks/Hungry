const express = require('express');
const router = express.Router();
const { MenuItem, Feedback, Seller, Cart, UserItem, sequelize } = require('../Modals/models');
const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth)

router.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.findAll();
        if (menuItems == []) throw new Error("No menu items found")
        res.status(201).json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/feedback', async (req, res) => {
    try {
        const { name, desc, rating, userName } = req.body;
        const checkSeller = await Seller.findOne({ where: { name: name } })
        if (checkSeller === null) throw new Error(`Seller with name ${name} not found!`);
        else {
            const newFeedbackItem = await Feedback.create({ feedback: desc, username: userName, adminName: name, rating });
            res.status(201).json(newFeedbackItem);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/feedback/:username', async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll({ where: { username: req.params.username } });
        if (feedbacks == []) throw new Error(`No feedbacks by ${userName} found`)
        res.status(201).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


router.post('/addToCart', async (req, res) => {
    try {
        const { userName, itemName, sellerName, quantity, itemPrice, userId } = req.body;
        const seller = await Seller.findOne({ where: { name: sellerName } })
        if (seller == null) throw new Error(`Seller with name ${sellerName} not found!`)
        const sellerId = seller.id;
        const data = await Cart.findOne({ where: { adminName: sellerName, username: userName, isPlaced: 0, isFinished: 0 } })
        if (data == null) {
            const newCart = await Cart.create({ total: 0, username: userName, adminName: sellerName, UserId: userId, SellerId: sellerId })
            const cartId = newCart.id;
            const newUserItem = await UserItem.create({ name: itemName, price: itemPrice, quantity: quantity, adminName: sellerName, CartId: cartId })
            const finalTotal = newCart.total + itemPrice * quantity;
            const rowsAffected = await Cart.update({ total: finalTotal }, { where: { id: cartId } })
            const finalCart = await Cart.findOne({ where: { id: cartId } })
            const items = await UserItem.findAll({ where: { adminName: sellerName, CartId: cartId } });
            const ans = { items: items, total: finalCart.total, adminName: sellerName, id: finalCart.id }
            res.status(201).json({ item: newUserItem, cart: finalCart, order: ans, status: 0 })
        }
        else {
            const cartId = data.id;
            const oldUserItem = await UserItem.findOne({ where: { name: itemName, CartId: cartId, adminName: sellerName } })
            if (oldUserItem == null) {
                const newUserItem = await UserItem.create({ name: itemName, price: itemPrice, quantity: quantity, adminName: sellerName, CartId: cartId })
                const finalTotal = data.total + itemPrice * quantity;
                const rowsAffected = await Cart.update({ total: finalTotal }, { where: { id: cartId } })
                const finalCart2 = await Cart.findOne({ where: { id: cartId } })
                res.status(201).json({ item: newUserItem, cart: finalCart2, order: null, status: 1 })
            }
            else {
                const itemId = oldUserItem.id
                const finalQuantity = oldUserItem.quantity + quantity;
                const rowsAffected = await UserItem.update({ quantity: finalQuantity }, { where: { id: itemId } })
                const newUserItem = await UserItem.findOne({ where: { id: itemId } })
                const finalTotal = data.total + itemPrice * quantity;
                const rowsAffected2 = await Cart.update({ total: finalTotal }, { where: { id: cartId } })
                const finalCart3 = await Cart.findOne({ where: { id: cartId } })
                res.status(201).json({ item: newUserItem, cart: finalCart3, order: null, status: 2 })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/currentCarts/:id', async (req, res) => {
    try {
        const carts = await Cart.findAll({ where: { UserId: req.params.id, isPlaced: 0, isFinished: 0 } });
        if (carts == []) throw Error("No carts open yet");
        const ans = await Promise.all(carts.map(async (cart) => {
            const cartId = cart.id
            const items = await UserItem.findAll({ where: { adminName: cart.adminName, CartId: cartId } });
            const data = { items: items, total: cart.total, adminName: cart.adminName, id: cart.id }
            return data
        }));
        res.status(201).json(ans)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/processedCart/:sellerName/:userName', async (req, res) => {
    try {
        const cart = await Cart.findOne({ where: { username: req.params.userName, adminName: req.params.sellerName, isPlaced: 0, isFinished: 0 } });
        if (cart == null) throw Error(`No orders are placed by ${req.params.userName} yet`);
        const cartId = cart.id
        const items = await UserItem.findAll({ where: { adminName: cart.adminName, CartId: cartId } });
        const data = { items: items, total: cart.total, adminName: cart.adminName, id: cart.id }
        res.status(201).json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/orderedCarts/:id', async (req, res) => {
    try {
        const carts = await Cart.findAll({ where: { UserId: req.params.id, isPlaced: 1 } , paranoid: false });
        if (carts == []) throw Error(`No orders are placed by ${req.params.userName} yet`);
        const ans = await Promise.all(carts.map(async (cart) => {
            const cartId = cart.id
            const items = await UserItem.findAll({ where: { adminName: cart.adminName, CartId: cartId } , paranoid : false });
            const data = { items: items, total: cart.total, adminName: cart.adminName, id: cart.id }
            return data
        }));
        res.status(201).json(ans)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/placeOrder', async (req, res) => {
    try {
        const { userName, sellerName } = req.body;
        const data = await Cart.findOne({ where: { adminName: sellerName, username: userName, isPlaced: 0, isFinished: 0 } })
        if (data == null) throw new Error(`Cart to ${sellerName} not created!`)
        else {
            const cartId = data.id;
            const rowsAffected = await Cart.update({ isPlaced: 1 }, { where: { id: cartId } })
            const placedOrder = await Cart.findOne({ where: { id: cartId, isPlaced: 1 } })
            const items = await UserItem.findAll({ where: { adminName: sellerName, CartId: cartId, adminName: sellerName } });
            const finalData = { items: items, total: placedOrder.total, adminName: sellerName, id: placedOrder.id }
            console.log(data);
            res.status(201).json(finalData)
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/changeQuantity', async (req, res) => {
    try {
        const { userName, sellerName, quantity, itemName } = req.body;
        const seller = await Seller.findOne({ where: { name: sellerName } })
        if (seller == null) throw new Error(`Seller with name ${sellerName} not found!`)
        const sellerId = seller.id;
        const data = await Cart.findOne({ where: { sellerId: sellerId, username: userName, isPlaced: 0 } })
        console.log(data);
        if (data == null) throw new Error(`Cart to ${sellerName} not created!`)
        else {
            const cartId = data.id;
            const oldUserItem = await UserItem.findOne({ where: { name: itemName, CartId: cartId } })
            if (oldUserItem == null) throw new Error(`Menu item with name ${itemName} not found!`)
            else {
                const itemId = oldUserItem.id
                const itemPrice = oldUserItem.price
                const finalQuantity = quantity;
                const initial = oldUserItem.quantity;
                const rowsAffected = await UserItem.update({ quantity: finalQuantity }, { where: { id: itemId } })
                const newUserItem = await UserItem.findOne({ where: { id: itemId } })
                const finalTotal = data.total + itemPrice * quantity - initial * itemPrice;
                Cart.update({ total: finalTotal }, { where: { id: cartId } })
                res.status(201).json({ item: newUserItem, total: finalTotal })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deleteItem', async (req, res) => {
    try {
        const { userName, sellerName, itemName } = req.body;
        const seller = await Seller.findOne({ where: { name: sellerName } })
        if (seller == null) throw new Error(`Seller with name ${sellerName} not found!`)
        const sellerId = seller.id;
        const data = await Cart.findOne({ where: { sellerId: sellerId, username: userName, isPlaced: 0 } })
        if (data == null) throw new Error(`Cart to ${sellerName} not created!`)
        else {
            const cartId = data.id;
            const oldUserItem = await UserItem.findOne({ where: { name: itemName, CartId: cartId } })
            if (oldUserItem == null) throw new Error(`Menu item with name ${itemName} not found!`)
            else {
                const itemId = oldUserItem.id
                const itemPrice = oldUserItem.price
                const initial = oldUserItem.quantity;
                const newUserItem = await UserItem.findOne({ where: { id: itemId } })
                const rowsAffected = await UserItem.destroy({ where: { id: itemId } })
                const finalTotal = data.total - initial * itemPrice;
                const rowsAffected2 = await Cart.update({ total: finalTotal }, { where: { id: cartId } })
                res.status(201).json({ item: newUserItem, total: finalTotal })
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

router.delete('/deleteCart', async (req, res) => {
    try {
        const { userName, sellerName } = req.body;
        const seller = await Seller.findOne({ where: { name: sellerName } })
        if (seller == null) throw new Error(`Seller with name ${sellerName} not found!`)
        const sellerId = seller.id;
        const data = await Cart.findOne({ where: { sellerId: sellerId, username: userName, isPlaced: 0 } })
        if (data == null) throw new Error(`Cart to ${sellerName} not created!`)
        else {
            const cartId = data.id;
            const rowsAffected = await UserItem.destroy({ where: { CartId: cartId } });
            const deletedCart = Cart.findOne({ where: { id: cartId } })
            const rowsAffected2 = Cart.destroy({ where: { id: cartId } })
            res.status(201).json(data)
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

router.post("/orderPayment", async (req, res) => {
    const { processedCart, userName } = req.body;
    try {
        const lineItems = await Promise.all(processedCart.items.map(async item => {
            const storeItem = await MenuItem.findOne({ where: { sellerName: processedCart.adminName, name: item.name } });
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: storeItem.name,
                        description: storeItem.description
                    },
                    unit_amount: storeItem.price * 100,
                },
                quantity: item.quantity,
            };
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            success_url: `http://localhost:3000/user/${userName}`,
            cancel_url: `http://localhost:3000/user/${userName}`,
        });

        res.status(201).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
