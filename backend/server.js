const express = require('express');
const app = express();
const PORT = 3000;

// Route أساسي
app.get('/', function(req, res) {
    res.send('Hello, Hotel Reservation!');
});

// تشغيل السيرفر
app.listen(PORT, function() {
    console.log('Server running on http://localhost:' + PORT);
});

const rooms = [
    { id: 1, name: "Single Room", type: "Single", price: 100, capacity: 1 },
    { id: 2, name: "Double Room", type: "Double", price: 180, capacity: 2 },
    { id: 3, name: "Family Suite", type: "Suite", price: 250, capacity: 4 },
    { id: 4, name: "Deluxe Room", type: "Deluxe", price: 300, capacity: 2 },
    { id: 5, name: "Presidential Suite", type: "Suite", price: 500, capacity: 6 },
    { id: 6, name: "Economy Room", type: "Single", price: 80, capacity: 1 },
    { id: 7, name: "Luxury Double", type: "Double", price: 220, capacity: 2 },
    { id: 8, name: "Honeymoon Suite", type: "Suite", price: 400, capacity: 2 },
    { id: 9, name: "Standard Room", type: "Single", price: 120, capacity: 1 },
    { id: 10, name: "Executive Suite", type: "Suite", price: 350, capacity: 3 }
];

app.get('/api/rooms', function(req, res) {
    res.json(rooms);
});

let reservations = [];

app.post('/api/reservations', express.json(), function(req, res) {
    const reservation = req.body;
    reservation.id = reservations.length + 1;
    reservations.push(reservation);
    res.json({ message: "Reservation added successfully", reservation: reservation });
});

app.get('/api/reservations', function(req, res) {
    res.json(reservations);
});