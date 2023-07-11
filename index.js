const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
app.use(bodyParser.json());
app.use(cors());
const health = require('./routes/health')
const bookseat = require('./routes/BookSelf')
const login = require('./routes/Login')
const bookguest = require('./routes/BookGuest')
const allseats = require('./routes/GetAllSeats')
const seatsbydate = require('./routes/GetSeatsByDate')
const seatsbyid = require('./routes/GetSeatsByID')
const groupmembers = require('./routes/GetTeamMembers')
const guestbookings = require('./routes/GetGuestsByID')
const removeguests = require('./routes/DeleteGuestByID')
const getdetails = require('./routes/GetDetailsFromEmail')
const createUser = require('./routes/CreateNewUser');
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
app.use('/', getdetails)
app.use('/', createUser);

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



const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port ${port}`));

