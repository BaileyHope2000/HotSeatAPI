const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

var jsonParser = bodyParser.json()

app.use(bodyParser.json());
app.use(cors());

var seats = [
    { id: "195c5d65-0888-4370-a6d2-110c7828b33d", date: "02-03-2023", room: "East Stables Room 1", user: {name: "John Doe", job: 'Project Manager', image:'url'}, groupPermission: 'true' },
    { id: "7d8f8b29-7a4f-4732-88ce-b8726c83296a", date: "02-03-2023", room: "East Stables Room 1", user: {name: "Jane Smith" , job: 'IT Technician', image:'url'}, groupPermission: 'false' },
    { id: "e491bfef-d4ea-438b-b62b-a12c8246c9c5", date: "02-03-2023", room: "East Stables Room 1", user: {name: "Bob Johnson", job: 'SAP Developer', image:'url'}, groupPermission: 'false' },
    { id: "fb799bad-6eab-4512-9794-3681cd2f4267", date: "02-03-2023", room: "East Stables Room 1", user: {name: "Emily Brown", job: 'SAP Team Leader', image:'url'}, groupPermission: 'true'  },
    { id: "e0ffd959-c3c4-45d9-9a3c-7fdfe9c69a63", date: "02-03-2023", room: "East Stables Room 1", user: {name: "Michael Davis", job: 'Software Engineer', image:'url'}, groupPermission: 'false'  },
    { id: "57c55cf0-a9b4-4d1b-a06b-9d1c0731e551", date: "01-03-2023", room: "East Stables Room 1", user: {name: "John Doe", job: 'Project Manager', image:'url'}, groupPermission: 'true' },
    { id: "80c9dd08-bf2e-454f-890c-d97a47f06e58", date: "02-03-2023", room: "East Stables Room 2", user: {name: "Jane Doe", job: 'Software Engineer', image:'url'}, groupPermission: 'false' },
    { id: "6d325ac0-d7d7-435a-9a2e-571e527dd94a", date: "03-03-2023", room: "East Stables Room 1", user: {name: "Bob Smith", job: 'Product Manager', image:'url'}, groupPermission: 'true' },
    { id: "507433d9-45be-4dd8-b032-ab9bd90e9922", date: "04-03-2023", room: "East Stables Room 2", user: {name: "Emma Johnson", job: 'Data Scientist', image:'url'}, groupPermission: 'false' },
    { id: "195c5d65-0888-4370-a6d2-110c7828b33d", date: "05-03-2023", room: "East Stables Room 1", user: {name: "Michael Davis", job: 'UX Designer', image:'url'}, groupPermission: 'true' },
    { id: "83f75af3-df6b-43a2-9187-982954ea6c79", date: "06-03-2023", room: "East Stables Room 2", user: {name: "Sophia Lee", job: 'Front-end Developer', image:'url'}, groupPermission: 'false' },
    { id: "df6e2aec-0b82-4400-ab79-fe5040a5dfcd", date: "07-03-2023", room: "East Stables Room 1", user: {name: "John Doe", job: 'Project Manager', image:'url'}, groupPermission: 'true' },
    { id: "80c9dd08-bf2e-454f-890c-d97a47f06e58", date: "08-03-2023", room: "East Stables Room 2", user: {name: "Jane Doe", job: 'Software Engineer', image:'url'}, groupPermission: 'false' },
    { id: "7d8f8b29-7a4f-4732-88ce-b8726c83296a", date: "09-03-2023", room: "East Stables Room 1", user: {name: "Bob Smith", job: 'Product Manager', image:'url'}, groupPermission: 'true' },
    { id: "7e639faf-5e6d-4ce1-b99f-5a2dffb687ea", date: "10-03-2023", room: "East Stables Room 2", user: {name: "Emma Johnson", job: 'Data Scientist', image:'url'}, groupPermission: 'false' }
  ];

app.post('/seats',jsonParser, (req, res) => {
  //add a check to make sure the seat isn't already taken
    const { id, date, room, user } = req.body;
    seats = seats.filter(
        (seat) => !(seat.date === date && seat.user.name === user.name)
      );
    seats.push({ id, date, room, user, groupPermission: 'false' });
    res.set('Access-Control-Allow-Origin', '*');
    res.json({ message: 'Seat added successfully', seats });
    console.log({ id, date, room, user, groupPermission: 'false' })
});

app.get("/seats/all", (req, res) => {
  res.status(200).json(seats);
});

app.get('/seats/:date', (req, res) => {
    const date = req.params.date;
    const seatsForDate = seats.filter(seat => seat.date === date);
    if (!seatsForDate.length) {
        res.json({ message: 'No seats found for the provided date' });
    }
    else {
        res.json({ seatIds: seatsForDate });
    }
});

app.get("/api/seats/:name", (req, res) => {
    const name = req.params.name;
    const seat = seats.filter(s => s.user.name === name);
  
    if (seat) {
      res.status(200).send(seat);
    } else {
      res.status(404).json({ error: `No working days found for user with name "${name}"` });
    }
  });

app.delete("/seats/:id/:date", (req, res) => {
    const { id, date } = req.params;
  
    seats = seats.filter((seat) => !(seat.id === id && seat.date === date));
  
    res.json({ message: "Seat successfully removed." });
  });

let groups = [
    {
      name: "Group1",
      members: ["User1", "User2", "User3"]
    },
    {
      name: "Group2",
      members: ["User4", "User5"]
    },
    {
      name: "Group3",
      members: ["User6", "User7", "User8", "User9"]
    }
  ];
  
  app.get("/group/:name", (req, res) => {
    const name = req.params.name;
    const group = groups.find(group => group.name === name);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    return res.json(group);
  });

app.listen(8080, () => {
    console.log('Server started on port 8080');
});
