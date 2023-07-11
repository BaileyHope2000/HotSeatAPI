const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.get('/api/getguestbookings/:user_id', (req, res) => {
    const user_id = req.params.user_id;
    connection.query(
        `SELECT bookings.*, guests.* 
		FROM bookings 
		INNER JOIN guests ON bookings.guest_id = guests.guest_id 
		WHERE bookings.user_id = ? AND bookings.guest_id IS NOT NULL`,
        [user_id],
        (error, results) => {
            console
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching bookings with guests' });
            } else if (results.length === 0) {
                res.json({ message: 'No bookings with guests found for the provided host_id' });
            } else {
                res.json({ visitors: results });
            }
        }
    );
});

module.exports = router;
