const jwt = require("jsonwebtoken");
const config = require("config");
const jwtsecret = config.get("jwtsecret");

const auth = (req, res, next) => {
    const token = req.headers['x-auth-token'];

    //Check if token is not avaliable
    if (!token) {
        return res.status(401).json({ msg: 'Authorization Denied' })
    }

    //Verify token
    try {
        const decoded = jwt.verify(token, jwtsecret);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(403).json({ msg: "Token is not valid" });
    }
}
module.exports = auth;