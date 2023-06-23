const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const connection = require('../db');

router.get("/api/group/:groupNumber", (req, res) => {
    const groupNumber = req.params.groupNumber;
    console.log(groupNumber)
    connection.query(
        'SELECT * FROM users WHERE group_id = ?',
        [groupNumber],
        (error, results) => {
            var jsonData = JSON.parse(JSON.stringify(results));
            if (error) {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            } else if (!results.length) {
                res.status(404).json({ message: `No members found for group with id ${groupNumber}` });
            } else {
                res.json(jsonData);
            }
        }
    );
});

module.exports = router;
