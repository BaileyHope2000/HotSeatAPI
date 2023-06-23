const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
var jsonParser = bodyParser.json();
app.use(bodyParser.json());
app.use(cors());
const health = require('./routes/health')
const bookseat = require('./routes/bookseat')
const login = require('./routes/login')
const bookguest = require('./routes/bookguest')
const allseats = require('./routes/allseats')
const seatsbydate = require('./routes/seatsbydate')
const seatsbyid = require('./routes/seatsbyid')
const groupmembers = require('./routes/groupmembers')
const guestbookings = require('./routes/guestbookings')
const removeguests = require('./routes/removeguests')
const connection = require('./db');

app.use('/', health); // use your route

app.use('/', bookseat)

app.use('/', login)

app.use('/', bookguest)

app.use('/', allseats)

app.use('/', seatsbydate)

app.use('/', seatsbyid)

app.use('/', groupmembers)

app.use('/', guestbookings)

app.use('/', removeguests)

function logToFile(text) {
	fs.appendFile('Logs.txt', text + '\n', function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
}

app.get('/api/users/first', (req, res) => {
	const query = 'SELECT * FROM users ORDER BY id ASC LIMIT 1';

	connection.query(query, (error, results) => {
		if (error) {
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
			return;
		}
		if (results.length > 0) {
			res.json(results[0]);
		} else {
			res.status(404).json({ error: 'No users found' });
		}
	});
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

