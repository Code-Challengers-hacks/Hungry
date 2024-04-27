const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validator = require('validator')
const { User, Seller } = require('../Modals/models');
const Op = require('sequelize')
const jwt = require('jsonwebtoken')

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET, { expiresIn: '3d' })
}


router.post('/register', async (req, res) => {
    const { username, email, password, mode } = req.body;
    try {
        if (username === "") { throw new Error("Username cannot be empty!") }
        if (password === "") { throw new Error("Password cannot be empty") }
        if (email === "") { throw new Error("Email cannot be empty") }

        if (!validator.isStrongPassword(password)) {
            throw new Error('Password not strong enough')
        }
        else if (!validator.isEmail(email)) {
            throw new Error("Invalid email format!")
        }

        if (mode == "User") {
            const existingUser = await User.findOne({ where: { name: username, email: email } });

            if (existingUser === null) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                const newUser = await User.create({ name: username, email: email, password: hash });
                const token = createToken(newUser.id)
                res.status(201).json({ message: 'User registered successfully', user: newUser , token : token });
            } else
                throw new Error("User with the same username and email already exists. Please provide different credentials.");
        }
        else if (mode == "Seller") {
            const existingSeller = await Seller.findOne({ where: { name: username, email: email } });

            if (existingSeller === null) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                const newSeller = await Seller.create({ name: username, email: email, password: hash });
                const token = createToken(newSeller.id)
                res.status(201).json({ message: 'Seller registered successfully', seller: newSeller , token : token });
            } else
                throw new Error("Seller with the same username and email already exists. Please provide different credentials.");

        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, email, password, mode } = req.body;
    try {
        if (username === "") { throw new Error("Username cannot be empty!") }
        if (password === "") { throw new Error("Password cannot be empty") }
        if (email === "") { throw  new Error("Email cannot be empty") }

        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format!")
        }

        try {
            if (mode == "Seller") {
                const data = await Seller.findOne({ where: { name: username, email: email } });
                if (data != null) {
                    const match = await bcrypt.compare(password, data.password)
                    if (!match) throw new Error("Incorrect password!")
                    const token = createToken(data.id)
                    res.status(201).json({ message: 'Seller login successfully', seller : data , token : token });
                } else
                    throw new Error("Username not found!")
            }
            else if (mode == "User") {
                const data = await User.findOne({ where: { name: username, email: email } });
                if (data != null) {
                    const match = await bcrypt.compare(password, data.password)
                    if (!match) throw new Error("Incorrect password!")
                    const token = createToken(data.id)
                    res.status(201).json({ message: 'User login successfully', user: data , token : token});
                } else
                    throw new Error("Username not found!")
            }
        } catch (error) {
            throw new Error(error)
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

module.exports = router;