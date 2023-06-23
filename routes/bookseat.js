const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.post('/api/bookseat', jsonParser, (req, res) => {

    const { seat_id, booking_date, room_name, user_id } = req.body;
    const parsedDate = new Date(booking_date);
    connection.query(
        'SELECT * FROM bookings WHERE seat_id = ? AND booking_date = ?',
        [seat_id, parsedDate],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error checking seat availability' });
            } else if (results.length > 0) {
                res.json({ message: 'Seat already taken' });
            } else {
                connection.query(
                    'DELETE FROM bookings WHERE booking_date = ? AND user_id = ?',
                    [parsedDate, user_id],
                    (error) => {
                        if (error) {
                            console.error(error);
                            res.status(500).json({ message: 'Didnt delete' });
                        } else {
                            if (seat_id) {
                                createBooking(res, parsedDate, seat_id, room_name, user_id, null);
                            } else {
                                res.json({ message: 'Booking removed successfully' });
                            }
                        }
                    }
                );
            }
        }
    );
});

function createBooking(res, booking_date, seat_id, room_name, user_id, guest_id) {
    connection.query(
        'INSERT INTO bookings (booking_date, seat_id, room_name, user_id, guest_id) VALUES (?, ?, ?, ?, ?)',
        [booking_date, seat_id, room_name, user_id, guest_id],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error creating booking' });
            } else {
                res.status(201).json({ message: 'Booking created successfully' });
            }
        }
    );
}

module.exports = router;
