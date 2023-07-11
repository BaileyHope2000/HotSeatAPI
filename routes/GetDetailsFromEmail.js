const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('/api/getdetails/:email', (req, res) => {
    const { email } = req.params;
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error retrieving user details' });
            } else if (results.length > 0) {
                const user = results[0];
                res.status(200).json({
                    message: true,
                    user_id: user.user_id,
                    email: user.email,
                    name: user.name,
                    job: user.job,
                    group_leader: user.group_leader,
                    group_id: user.group_id,
                    admin: user.admin
                });
            } else {
                res.status(404).json({ message: 'No user found with the provided email' });
            }
        }
    );
});

module.exports = router;
