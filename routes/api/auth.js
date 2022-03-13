const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtsecret = config.get("jwtsecret");

//@Route    GET /api/auth
//@desc     Get Current User data
//@access   Private
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        return res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error")
    }
})

//@Route    POST /api/auth
//@desc     Login User
//@access   Public
router.post("/", [
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {

    const { email, password } = req.body;

    //Validating Data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    //Check if user already exists
    try {
        const findUser = await User.findOne({ email });

        if (!findUser) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const isMatch = await bcryptjs.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        const payload = {
            user: {
                id: findUser._id
            }
        }

        jwt.sign(payload, jwtsecret, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            return res.status(200).json({ token });
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
})



module.exports = router;