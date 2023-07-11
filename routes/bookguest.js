const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.post('/api/bookguest', jsonParser, async (req, res) => {
    const { name, email, host_id, booking_date, seat_id, room_name } = req.body;
    const parsedDate = new Date(booking_date);
    parsedDate.setDate(parsedDate.getDate() + 1);
    try {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        connection.query(
            'SELECT * FROM guests WHERE email = ?',
            [email],
            (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Error checking for existing guest' });
                } else if (results.length > 0) {
                    // Guest already exists, use the existing guest_id
                    const guest_id = results[0].guest_id;
                    createBooking(res, parsedDate, seat_id, room_name, host_id, guest_id);
                } else {
                    // Add a new guest to the guests table
                    connection.query(
                        'INSERT INTO guests (name, email, host_id) VALUES (?, ?, ?)',
                        [name, email, host_id],
                        (error, results) => {
                            if (error) {
                                console.error(error);
                                res.status(500).json({ message: 'Error adding guest' });
                            } else {
                                // Get the guest_id of the newly added guest
                                const guest_id = results.insertId;
                                createBooking(res, parsedDate, seat_id, room_name, host_id, guest_id);
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
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