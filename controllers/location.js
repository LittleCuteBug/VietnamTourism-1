const db = require('../db/models');
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');

const Location = db.Location;

const addLocation = async (req, res) => {
    const imgBase64Data = req.body.image.replace(/^data:image\/png;base64,/, "")
    const url = 'images\/' + uuidv4() + '.png'
    const newLocation = {
        name: req.body.name,
        address: req.body.address,
        image: url,
        priceMinPerPerson: req.body.priceMinPerPerson,
        priceMaxPerPerson: req.body.priceMaxPerPerson,
        timeOpen: req.body.timeOpen,
        timeClose: req.body.timeClose,
        type: req.body.type
    }
    try {
        if(!fs.existsSync('images')) {
            fs.mkdirSync('images');
        }
        await fs.promises.writeFile(url, imgBase64Data, 'base64');
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

const getAllLocations = async (req, res) => {
    try {
        let locationList = await Location.findAll();
        for (const obj of locationList) {
            const imageURL = obj.get('image')
            const imageData = await fs.promises.readFile(imageURL,'base64')
            obj.set('image', imageData)
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
            const imageURL = obj.get('image')
            const imageData = await fs.promises.readFile(imageURL,'base64')
            obj.set('image', imageData)
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

const filterLocation = () => {
    try {
        console.log(req.body);
        
    } catch (error) {
        res.status(500).send({
            code:1,
            message: error.message
        })
    }

}



const location = {
    addLocation: addLocation,
    getAllLocations: getAllLocations,
    getLocationWithId: getLocationWithId,
    deleteLocationWithId: deleteLocationWithId,
    filterLocation: filterLocation
}
module.exports = location;