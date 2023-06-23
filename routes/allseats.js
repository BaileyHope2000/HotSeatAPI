const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.get('/api/seats/all', (req, res) => {
    connection.query('SELECT bookings.*, users.* FROM bookings INNER JOIN users ON bookings.user_id = users.user_id', (error, results) => {
        var jsonData = JSON.parse(JSON.stringify(results));
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching seats' });
        } else {
            res.status(200).json(jsonData);
        }
    });
});

module.exports = router;