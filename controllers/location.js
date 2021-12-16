const db = require('../db/models');
const lib = require('../lib');
const {Op} = require('sequelize');
const Sequelize = db.Sequelize;
const sequelize = db.sequelize;
const fs = require("fs");

const Location = db.Location;

const addLocation = async (req, res) => {
    const {imgBase64Data, url} = lib.getImageData(req.body.image)
    const newLocation = {
        name: req.body.name,
        address: req.body.address,
        description: req.body.description,
        price: req.body.price,
        image: url,
        timeOpen: req.body.timeOpen,
        timeClose: req.body.timeClose,
        type: req.body.type
    }
    try {
        if(!fs.existsSync('images')) {
            fs.mkdirSync('images');
        }
        if(url) {
            await fs.promises.writeFile(url, imgBase64Data, 'base64');
        }
        await Location.create(newLocation);
        res.status(200).send({
            code: 0,
            message: "Add new location success!"
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const findLocations = async (req, res) => {
    try {
        let query = "";
        if (req.query.name || req.query.address) {
            query = `
            (
                MATCH (name) AGAINST('${req.query.name}' IN NATURAL LANGUAGE MODE) OR
                MATCH (address) AGAINST('${req.query.address}' IN NATURAL LANGUAGE MODE)
            )
            AND
            `
        }
        let [locationList, metadata] = await sequelize.query(
            `
                SELECT *
                FROM Locations
                WHERE
                    ${query}
                    price <= ${req.query.price ? req.query.price : '99999999999999'}
            `
        )
        for (const obj of locationList) {
            const imageURL = obj.image
            obj.image = await lib.readImageFromURL(imageURL);
        }
        res.status(200).send(locationList);
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const getLocationWithId = async (req, res) => {
    try {
        let location = await Location.findAll({
            where: {
                id: req.params.id
            }
        });
        for (const obj of location) {
            const imageURL = obj.image
            obj.image = await lib.readImageFromURL(imageURL);
        }
        res.status(200).send(location);
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}

const deleteLocationWithId = async (req, res) => {
    try {
        let location = await Location.findAll({
            where: {
                id: req.params.id
            }
        });

        for (const obj of location) {
            const imageURL = obj.get('image')
            if(imageURL)
                await fs.promises.unlink(imageURL)
        }

        await Location.destroy({
            where: {
                id: req.params.id
            }
        });

        res.status(200).send({
            message: `Deleted location with id: ${req.params.id}`
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}


const updateLocation = async (req, res) => {
    try {
        let location = await Location.findOne({
            where: {
                id: req.body.id
            }
        });
        if (req.body.image) {
            const {imgBase64Data, url} = lib.getImageData(req.body.image);
            if(!fs.existsSync('images')) {
                fs.mkdirSync('images');
            }
            if(url) {
                await fs.promises.writeFile(url, imgBase64Data, 'base64');
            }
            location.image = url;
        }
        location.name = req.body.name ? req.body.name : location.name;
        location.address = req.body.address ? req.body.address : location.address;
        location.description = req.body.description ? req.body.description : location.description;
        location.price = req.body.price ? req.body.price : location.price;
        location.timeOpen = req.body.timeOpen ? req.body.timeOpen : location.timeOpen;
        location.timeClose = req.body.timeClose ? req.body.timeClose : location.timeClose;
        location.type =  req.body.type ? req.body.type : location.type;
        await location.save();
        
        res.status(200).send({
            message: `Updated location with id: ${req.body.id}`
        });
    } catch (error) {
        res.status(500).send({
            code: 1,
            message: error.message
        });
    }
}






const location = {
    addLocation: addLocation,
    findLocations: findLocations,
    getLocationWithId: getLocationWithId,
    deleteLocationWithId: deleteLocationWithId,
    updateLocation: updateLocation
}
module.exports = location;