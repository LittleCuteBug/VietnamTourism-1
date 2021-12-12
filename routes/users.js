const express = require('express');
const router = express.Router();
const {verifyRegister, authJwt} = require('../middlewares');
const controller = require('../controllers');

router.get(
    '/',
    authJwt.verifyToken,
    authJwt.isAdmin,
    (req, res) => {
        res.send("Hello");
    }
)
router.get(
    '/info',
    controller.user.getInfo
);
router.get(
    '/list',
    controller.user.getAll
)
router.post(
    '/login',
    controller.user.login
);
router.post(
    '/register', 
    verifyRegister.checkDuplicateUsername,
    controller.user.register
);
router.get(
    '/tours',
    controller.user.getTours
)

module.exports = router;