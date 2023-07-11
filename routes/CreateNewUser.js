const express = require('express');
const router = express.Router();
const connection = require('../db');  // adjust the path based on your file structure

router.post('/api/createuser', (req, res) => {
    const { email } = req.body;
    if (!email || !email.endsWith("@croda.com")) {
        res.status(400).json({ message: 'Invalid email' });
        return;
    }

    const name = email.replace("@croda.com", "").replace(".", " ");

    // generic details
    const job = 'N/A';  // example generic job
    const group_id = 0;  // example generic group_id
    const group_leader = 0;
    const admin = 0;

    connection.query(
        'INSERT INTO users (email, name, job, group_leader, group_id, admin) VALUES (?, ?, ?, ?, ?, ?)',
        [email, name, job, group_leader, group_id, admin],
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Error creating user' });
            } else {
                res.status(201).json({ message: 'User created successfully', userId: results.insertId });
            }
        }
    );
});

module.exports = router;
