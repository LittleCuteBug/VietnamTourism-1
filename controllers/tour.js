const db = require('../db/models');
const Tour = db.Tour;
const Location = db.Location;
const TourReview = db.TourReview;


const createTour = async (req, res) => {
    const newTour = {
        UserId: req.body.userId,
        name: req.body.name,
        description: req.body.description
    }
    try {
        let thisTour = await Tour.create(newTour);
        res.status(200).send({
            code: 0,
            tourId: thisTour.id,
            message: "Add new Tour success!"
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const addLocation = async (req, res) => {
    try {
        let thisTour = await Tour.findOne({
            where: {
                id: req.body.tourId
            }
        });
        if (!thisTour)
            throw "Tour not found!";

        let locationIdList = req.body.locations;
        let locationList = await Location.findAll({
            where: {
                id: locationIdList
            }
        })
        await thisTour.setLocations(locationList);

        
        res.status(200).send({
            code: 0,
            message: "Add Tour's locations success!"
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const deleteTour = async (req, res) => {
    try {
        await Tour.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).send({
            code: 0,
            message: "Delete Tour success!"
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const addReview = async (req, res) => {
    try {
        let thisTour = await Tour.findOne({
            where:{
                id: req.body.tourId
            }
        });
        if (!thisTour)
            throw "Tour not found!";
        let newTourReview = {
            userId: req.body.userId,
            comment: req.body.comment,
            star: req.body.star,
            create_date: Date.now()
        }
        let TourReviewInstace = await TourReview.create(newTourReview);
        thisTour.setTourReviews(TourReviewInstace);
        res.status(200).send({
            code: 0,
            message: "Add new tour review success"
        });

    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}
const deleteReview = async (req, res) => {
    try {
        await TourReview.destroy({
            where: {
                id: req.params.review_id
            }
        })
        res.status(200).send({
            code: 0,
            message: "Delete tour review success"
        });

    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });  
    }
}

const updateData = async (req, res) => {
    try {
        let thisTour = await Tour.findOne({
            where: {
                id: req.body.tourId
            }
        });
        let locationIdList =  req.body.locations ? req.body.locations : [];
        let locationList = await Location.findAll({
            where: {
                id: locationIdList
            }
        })
        await thisTour.update({
            name: req.body.name ? req.body.name : thisTour.name,
            description: req.body.description ? req.body.description : thisTour.description
        })
        await thisTour.setLocations(locationList);
        res.status(200).send("Update tour success!");
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });  
    }
}






const tour = {
    createTour: createTour,
    addLocation: addLocation,
    deleteTour: deleteTour,
    addReview: addReview,
    deleteReview: deleteReview,
    updateData: updateData
}
module.exports = tour;