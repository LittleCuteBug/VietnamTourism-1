const express = require('express');
const router = express.Router();
const locations_router = require('./locations');
const tours_router = require('./tours');
const users_router = require('./users');

// simple route
router.get("/", (req, res) => {
    res.json({ message: "Welcome HOME." });
});
router.use('/locations', locations_router);
router.use('/tours', tours_router);
router.use('/users', users_router);

module.exports = router;



  