const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtsecret = config.get("jwtsecret");

//@Route    POST /api/user
//@desc     Register User
//@access   Public
router.post("/", [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password should be at least 6 charcters long').isLength({ min: 6 }),
], async (req, res) => {

    const { name, email, password } = req.body;

    //Validating Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    //Check if user already exists
    try {
        const findUser = await User.findOne({ email })
        if (findUser) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        let newUser = new User({
            name, email, password, avatar
        })

        const salt = await bcryptjs.genSalt(10);
        newUser.password = await bcryptjs.hash(password, salt);

        const savedUser = await newUser.save();

        const payload = {
            user: {
                id: savedUser._id
            }
        }

        jwt.sign(payload, jwtsecret, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            return res.status(201).json({ token });
        })

    } catch (error) {
        console.log(error.message);
        await User.deleteOne({ email: req.body.email });
        return res.status(500).send("Internal Server Error");
    }
})



module.exports = router;