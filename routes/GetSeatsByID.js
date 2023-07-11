const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.get('/api/api/seats/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    connection.query(
        'SELECT * FROM bookings WHERE user_id = ?',
        [user_id],
        (error, results) => {
            var jsonData = JSON.parse(JSON.stringify(results));
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            } else if (!results.length) {
                res.status(404).json({ message: `No seats found for user with id ${user_id}` });
            } else {
                res.json(jsonData);
            }
        }
    );
});

module.exports = router;
