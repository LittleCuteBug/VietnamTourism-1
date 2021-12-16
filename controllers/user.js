const db = require('../db/models');
const User = db.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {getDataFromToken} = require('../middlewares/auth');


const register = async (req, res) => {
    const newUser = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 8),
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        role: "user"
    }
    try {
        await User.create(newUser);
        res.status(200).send({
            code: 0,
            message: "Register success!"
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
    
}

const login = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if (!user)  {
            res.status(404).send({
                code: 1,
                message: "User not found!"
            });
            return;
        }
        
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            res.status(401).send({
                code: 1,
                accessToken: null,
                message: "Invalid Password!"
            })
            return;
        }
        let token = jwt.sign({id: user.id, role: user.role}, process.env.SECRET_KEY);
        res.status(200).send({
            code: 0,
            accessToken: token,
            username: req.body.username,
            name: user.firstname + ' ' + user.lastname,
            userId: user.id,
            role: user.role,
            message: "Login success!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const getInfo = async (req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let tokenData = getDataFromToken(token);
        let user = await User.findOne({
            where: {
                id: tokenData.id
            }
        })
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const getTours = async(req, res) => {
    try {
        let token = req.headers["x-access-token"];
        let tokenData = getDataFromToken(token);
        let user = await User.findOne({
            where: {
                id: tokenData.id
            }
        })
        let toursOfUser = await user.getTours();
        let response = [];
        for (let tour of toursOfUser) {
            response.push({
                tour: tour,
                location: await tour.getLocations()
            })
        }
        res.send(response);
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const getAll = async (req, res) => {
    try {
        const userList = await User.findAll();
        res.status(200).send(userList);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send("Delete user success!");
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}
const updateUser = async (req, res) => {
    try {
        let token = req.headers['x-access-token'];
        let tokenData = await getDataFromToken(token);
        let user = await User.findOne({
            where: {
                id: tokenData.id
            }
        });
        user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
        user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
        user.phonenumber = req.body.phonenumber ? req.body.phonenumber : user.phonenumber;
        if (req.body.password)
            user.password = bcrypt.hashSync(req.body.password, 8);
        await user.save();
        res.status(200).send("Update user success!");
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}
const user = {
    updateUser: updateUser,
    login: login,
    register: register,
    getInfo: getInfo,
    getTours: getTours,
    getAll: getAll,
    deleteUser: deleteUser
}
module.exports = user;