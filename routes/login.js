const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    connection.query(
        'SELECT * FROM login WHERE email = ? AND password = ?',
        [email, password],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error logging in' });
            } else if (!results.length) {
                res.json({ message: 'Incorrect username or password' });
            } else {
                connection.query(
                    'SELECT * FROM users WHERE email = ?',
                    [email],
                    (error, results) => {
                        const user = results[0];
                        res.json({
                            message: true,
                            user_id: user.user_id,
                            email: user.email,
                            name: user.name,
                            job: user.job,
                            // image_url: user.image_url,
                            group_leader: user.group_leader,
                            group_id: user.group_id,
                            admin: user.admin
                        });
                    }
                )
            }
        }
    );
});

module.exports = router;
