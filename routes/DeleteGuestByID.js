const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.delete('/api/removeguestbooking/:guest_id', (req, res) => {
    const guest_id = req.params.guest_id;

    // Step 1: Delete the booking(s) for the guest
    connection.query(
        'DELETE FROM bookings WHERE guest_id = ?',
        [guest_id],
        (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error deleting bookings for the guest' });
            } else {
                // Step 2: Check if there are any linked bookings left for the guest
                connection.query(
                    'SELECT * FROM bookings WHERE guest_id = ?',
                    [guest_id],
                    (error, results) => {
                        if (error) {
                            console.error(error);
                            res.status(500).json({ message: 'Error checking for remaining guest bookings' });
                        } else if (results.length === 0) {
                            // If no linked bookings left, remove the guest entry from the guests table
                            connection.query(
                                'DELETE FROM guests WHERE guest_id = ?',
                                [guest_id],
                                (error) => {
                                    if (error) {
                                        console.error(error);
                                        res.status(500).json({ message: 'Error deleting guest' });
                                    } else {
                                        res.json({ message: 'Guest and their bookings removed successfully' });
                                    }
                                }
                            );
                        } else {
                            res.json({ message: 'Bookings removed, but the guest still has linked bookings' });
                        }
                    }
                );
            }
        }
    );
});

module.exports = router;