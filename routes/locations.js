const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const { authJwt } = require('../middlewares');

router.get(
    '/', 
    controller.location.findLocations
);
router.get(
    '/:id',
    controller.location.getLocationWithId
);

router.post(
    '/add',
    controller.location.addLocation
);

router.post(
    '/update',
    controller.location.updateLocation
);


router.delete(
    '/delete/:id',
    authJwt.isAdmin,
    controller.location.deleteLocationWithId
)

module.exports = router;