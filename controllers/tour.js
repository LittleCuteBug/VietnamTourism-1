const { response } = require('express');
const db = require('../db/models');
const Tour = db.Tour;
const User = db.User;
const Location = db.Location;
const TourReview = db.TourReview;
const sequelize = db.sequelize;
const readImageFromURL = require('../lib/readImageFromURL');
const {authJwt} = require('../middlewares');

const updateTourRating = async () => {
    try {
        let TourList = await Tour.findAll();
        for (const tour of TourList) {
            let reviewOfTour = await tour.getTourReviews();
            let rating = 0;
            let count = 0;
            for (const review of reviewOfTour) {
                if (review.star) {
                    rating += review.star;
                    ++ count;
                }
            }
            tour.star = rating / count;
            await tour.save();
        }
    } catch (error) {
        console.log(error);
    }
}
const createTour = async (req, res) => {
    let token = req.headers["x-access-token"];
    let tokenData = authJwt.getDataFromToken(token);
    const newTour = {
        UserId: tokenData.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
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
        thisTour.addTourReview(TourReviewInstace);
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
            description: req.body.description ? req.body.description : thisTour.description,
            price: req.body.price ? req.body.price : thisTour.price
        })
        if (req.body.locations)
            await thisTour.setLocations(locationList);
        res.status(200).send("Update tour success!");
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });  
    }
}

const findTours = async (req, res) => {    
    try {
        await updateTourRating();
        let have_name_in_query = '';
        if (req.query.name) {
            have_name_in_query = ` MATCH (name) AGAINST('${req.query.name}' IN NATURAL LANGUAGE MODE) AND `
        }
        let locationNameQuerry = '';
        if (req.query.locationName) {
            console.log(req.query.locationName);
            let [locationList, metadata] = await sequelize.query(
                `
                    SELECT *
                    FROM Locations
                    WHERE
                        MATCH (name) AGAINST('${req.query.locationName}' IN NATURAL LANGUAGE MODE)
                `
            );
            const locationIdList = [];
            locationList.forEach((location) => {
                locationIdList.push(location.id);
            })
            let querr = '1';
            if (locationIdList.length) {
                querr = `
                LocationId IN (${locationIdList.join(',')})
                `
            }
            let [TourIdList, metadata2] = await sequelize.query(
                `
                    SELECT TourId
                    FROM TourLocation
                    WHERE
                        ${querr}
                `
            );
            TourIdList = TourIdList.map((tour) => tour.TourId);
            console.log(TourIdList);
            locationNameQuerry = `
                AND 
                    id IN (${TourIdList.join(',')})
            `
            
                
        }
        let [tourList, metadata] = await sequelize.query(
            `
                SELECT *
                FROM Tours
                WHERE
                    ${have_name_in_query}
                    price <= ${req.query.priceMax ? req.query.priceMax : '99999999999999'}
                    AND
                    price >= ${req.query.priceMin ? req.query.priceMin : '0'}
                    AND
                    star >= ${req.query.rating ? req.query.rating : '0'}
                    ${locationNameQuerry}
            `
        )
        let response = [];
        for (const tour of tourList) {
            let tourInstace = await Tour.findOne({where: {id: tour.id}});
            let locationOfTour = await tourInstace.getLocations();
            let locationList = [];
            for (let location of locationOfTour) {
                let image = await readImageFromURL(location.image);
                locationList.push({
                    location: location,
                    image: image
                })
            }
            response.push({
                tour: tour,
                location: locationList
            })
        }
        
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            code: 1,
            message: error.message
        }); 
    }
}

const getTourById = async (req, res) => {    
    try {
        let tour = await Tour.findOne({
            where: {
                id: req.params.id 
            }
        })
        let tourInstace = await Tour.findOne({where: {id: tour.id}});
        let locationOfTour = await tourInstace.getLocations();
        let locationList = [];
        let response = [];
        for (let location of locationOfTour) {
            let image = await readImageFromURL(location.image);
            locationList.push({
                location: location,
                image: image
            })
        }
        response.push({
            tour: tour,
            location: locationList
        })
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        }); 
    }
}

const getComments = async (req, res) => {
    try {
        let thisTour = await Tour.findOne({
            where: {
                id: req.query.id
            }
        });
        if (!thisTour)
            throw "Tour not found";
        let reviewList = await thisTour.getTourReviews();
        let response = [];
        for (const review of reviewList) {
            response.push({
                reviewid: review.id,
                userid: review.userId,
                user: await User.findOne({where: {id: review.userId}}),
                comment: review.comment,
                rating: review.star 
            });
        }
        res.status(200).send(response);
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        }); 
    }

}

const getRating = async (req, res) => {
    try {
        let thisTour = await Tour.findOne({
            where: {
                id: req.query.id
            }
        });
        if (!thisTour)
            throw "Tour not found";
        let reviewList = await thisTour.getTourReviews();
        let rate = 0;
        let count = 0;
        for (const review of reviewList) {
            if (review.star > 0) {
                ++ count;
                rate += review.star;
            }
        }
        rate /= count;
        res.status(200).send({rating: rate});
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
    updateData: updateData,
    findTours: findTours,
    getComments: getComments,
    getRating: getRating,
    getTourById: getTourById
}
module.exports = tour;