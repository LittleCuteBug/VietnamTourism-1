const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const { authJwt } = require('../middlewares');


router.get(
    '/', 
    controller.tour.findTours
);

router.get(
    '/comment',
    controller.tour.getComments
)

router.get(
    '/rating',
    controller.tour.getRating
)

router.post(
    '/create',
    authJwt.verifyToken,
    controller.tour.createTour
)

router.post(
    '/add_location',
    authJwt.verifyToken,
    controller.tour.addLocation
)

router.post(
    '/review_comment',
    authJwt.verifyToken,
    controller.tour.addReview
)

router.post(
    '/update',
    authJwt.verifyToken,
    controller.tour.updateData
)


router.delete(
    '/delete/:id',
    authJwt.verifyToken,
    controller.tour.deleteTour
)

router.delete(
    '/delete_review/:review_id',
    authJwt.verifyToken,
    controller.tour.deleteReview
)

module.exports = router;