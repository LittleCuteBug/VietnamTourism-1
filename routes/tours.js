const express = require('express');
const router = express.Router();
const controller = require('../controllers');


router.get(
    '/', 
    controller.tour.findTours
);

router.post(
    '/create',
    controller.tour.createTour
)

router.post(
    '/add_location',
    controller.tour.addLocation
)

router.post(
    '/review_comment',
    controller.tour.addReview
)

router.post(
    '/update',
    controller.tour.updateData
)


router.delete(
    '/delete/:id',
    controller.tour.deleteTour
)

router.delete(
    '/delete_review/:review_id',
    controller.tour.deleteReview
)

module.exports = router;