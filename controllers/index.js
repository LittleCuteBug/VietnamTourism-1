const user = require('./user');
const location = require('./location');
const tour = require('./tour');

const controller = {
    user: user,
    location: location,
    tour: tour
}

module.exports = controller;