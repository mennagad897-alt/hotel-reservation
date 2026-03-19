require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Reservation = require('./models/Reservation');

const app = express();
app.use(express.json());

// Database Connection using environment variable
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_reservation_db';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Connection error:', err));

// --- Auth Routes ---
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        res.status(400).json({ message: "Email already exists!" });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); 
    
    if (user) {
        res.json({ message: `Welcome, ${user.username}` });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

// --- Room Routes ---
app.post('/api/rooms', async (req, res) => {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json({ message: "Room added successfully" });
});

app.get('/api/rooms', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

// --- Booking Routes ---
app.post('/api/book', async (req, res) => {
    const { roomId, guestName, checkIn, checkOut } = req.body;
    
    const room = await Room.findById(roomId);
    if (!room || room.isBooked) return res.status(400).send("Room not available");

    const days = Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * room.price;

    const reservation = new Reservation({ roomId, guestName, checkIn, checkOut, totalPrice });
    await reservation.save();
    
    await Room.findByIdAndUpdate(roomId, { isBooked: true });
    res.status(201).json({ message: "Booking successful", details: reservation });
});

app.delete('/api/book/:id', async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).send("Reservation not found");

        await Room.findByIdAndUpdate(reservation.roomId, { isBooked: false });
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: "Booking cancelled and room is now free" });
    } catch (err) {
        res.status(500).send("Error deleting reservation");
    }
});

app.put('/api/book/:id', async (req, res) => {
    const updatedRes = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Data updated", updatedRes });
});

app.get('/api/book', async (req, res) => {
    try {
        const allReservations = await Reservation.find().populate('roomId');
        res.json(allReservations);
    } catch (err) {
        res.status(500).json({ message: "Error fetching reservations" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));