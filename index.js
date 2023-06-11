const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

var jsonParser = bodyParser.json();

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '5ogID1DOjbQs8Y8U',
	database: 'hotdeskdb',
	port: 3306
});

connection.connect((error) => {
	if (error) {
		console.error(error);
	} else {
		console.log('Connected to the database');
	}
});


//Book User
app.post('/bookseat', jsonParser, (req, res) => {
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
							res.status(500).json({ message: 'Internal server error' });
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


//Book Guest
app.post('/bookguest', jsonParser, async (req, res) => {
	const { name, email, host_id, booking_date, seat_id, room_name } = req.body;
	const parsedDate = new Date(booking_date);
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


app.get('/seats/all', (req, res) => {
	connection.query('SELECT bookings.*, users.* FROM bookings INNER JOIN users ON bookings.user_id = users.user_id', (error, results) => {
		var jsonData = JSON.parse(JSON.stringify(results));
		if (error) {
			console.error(error);
			res.status(500).json({ message: 'Error fetching seats' });
		} else {
			res.status(200).json(jsonData);
		}
	});
});

app.get('/seats/:date', (req, res) => {
	const booking_date = req.params.date;
	connection.query(
		`SELECT bookings.*, users.name as user_name, users.email as user_email, users.job as user_job, guests.name as guest_name, guests.email as guest_email
        FROM bookings
        LEFT JOIN users ON bookings.user_id = users.user_id
        LEFT JOIN guests ON bookings.guest_id = guests.guest_id
        WHERE booking_date = ?`,
		[booking_date],
		(error, results) => {
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


app.get('/api/seats/:user_id', (req, res) => {
	const user_id = req.params.user_id;
	connection.query(
		'SELECT * FROM bookings WHERE user_id = ?',
		[user_id],
		(error, results) => {
			var jsonData = JSON.parse(JSON.stringify(results));
			if (error) {
				console.error(error);
				res.status(500).json({ message: 'Internal server error' });
			} else if (!results.length) {
				res.status(404).json({ message: `No seats found for user with id ${user_id}` });
			} else {
				res.json(jsonData);
			}
		}
	);
});

app.get("/group/:groupNumber", (req, res) => {
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

app.get('/getguestbookings/:user_id', (req, res) => {
	const user_id = req.params.user_id;
	connection.query(
		`SELECT bookings.*, guests.* 
		FROM bookings 
		INNER JOIN guests ON bookings.guest_id = guests.guest_id 
		WHERE bookings.user_id = ? AND bookings.guest_id IS NOT NULL`,
		[user_id],
		(error, results) => {
			console
			if (error) {
				console.error(error);
				res.status(500).json({ message: 'Error fetching bookings with guests' });
			} else if (results.length === 0) {
				res.json({ message: 'No bookings with guests found for the provided host_id' });
			} else {
				res.json({ visitors: results });
			}
		}
	);
});

app.delete('/removeguestbooking/:guest_id', (req, res) => {
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

app.post('/login', (req, res) => {
	const { email, password } = req.body;
	console.log(email, password)
	connection.query(
		'SELECT * FROM login WHERE email = ? AND password = ?',
		[email, password],
		(error, results) => {
			console.log(results)
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
							image_url: user.image_url,
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


app.listen(8080, () => {
	console.log('Server started on port 8080');
});
