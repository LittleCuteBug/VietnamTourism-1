const jwt = require("jsonwebtoken");
const db = require('../db/models');
const User = db.User;


const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        res.status(403).send({
            code: 1,
            message: "No token provided!"
        })
        return;
    }
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).send({
                code: 1,
                message: "Unauthorized!"
            })
            return;
        }
        next();
    })
}

const isAdmin = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        res.status(403).send({
            code: 1,
            message: "No token provided!"
        })
        return;
    }
    
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(401).send({
                code: 1,
                message: "Error when authorization!"
            })
            return;
        }
        let role = decoded.role;
        if (role != "admin") {
            res.status(401).send({
                code: 1,
                message: "Require admin permission!"
            })
            return;
        }
        next();
    })
}

const getDataFromToken = (accessToken) => {
    try {
        let decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
        return decoded;
    } catch (error) {
        throw(error);
    }
}


const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    getDataFromToken: getDataFromToken
}

module.exports = authJwt;