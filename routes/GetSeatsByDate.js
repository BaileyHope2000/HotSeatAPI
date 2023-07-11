const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../db');

router.get('/api/seats/:date', (req, res) => {
	console.log(req.params.date)
	const booking_date = req.params.date
	connection.query(
		`SELECT bookings.*, users.name as user_name, users.email as user_email, users.job as user_job, guests.name as guest_name, guests.email as guest_email
        FROM bookings
        LEFT JOIN users ON bookings.user_id = users.user_id
        LEFT JOIN guests ON bookings.guest_id = guests.guest_id
        WHERE booking_date = ?`,
		[booking_date],
		(error, results) => {
			console.log(results)
			var jsonData = JSON.parse(JSON.stringify(results));
			if (error) {
				console.error(error);
				res.status(500).json({ message: 'Error fetching seats' });
			} else if (!results.length) {
				res.json({ message: 'No seats found for the provided date' });
			} else {
				res.json({ seatIds: jsonData });
			}
		}
	);
});

module.exports = router;