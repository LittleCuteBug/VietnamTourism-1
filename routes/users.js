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
    authJwt.verifyToken,
    controller.user.getInfo
);
router.get(
    '/list',
    authJwt.isAdmin,
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
router.post(
    '/update',
    authJwt.verifyToken,
    controller.user.updateUser
)
router.get(
    '/tours',
    authJwt.verifyToken,
    controller.user.getTours
)
router.delete(
    '/delete/:id',
    authJwt.isAdmin,
    controller.user.deleteUser
)
router.get(
    '/tour_comment/:id',
    controller.user.getCommentInTour
)

module.exports = router;