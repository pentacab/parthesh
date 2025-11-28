const router = require('express').Router();
const airports = require('../data/airports');
const cities = require('../cities.json');

router.get('/api/airports', (req, res) => res.json(airports));
router.get('/api/cities',  (req, res) => res.json(cities));

module.exports = router;
