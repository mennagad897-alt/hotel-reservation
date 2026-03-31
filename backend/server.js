import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";
import Room from "./models/Room.js";
import Reservation from "./models/Reservation.js";


// __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ===================== AUTH MIDDLEWARE ===================== */
const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "لم يتم العثور على توكن" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key_123");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "التوكن غير صالح" });
    }
};

/* ===================== DATABASE ===================== */
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_reservation_db';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Connection error:', err));

/* ===================== SIGNUP ===================== */
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Account created successfully!" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/* ===================== LOGIN ===================== */
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const secretKey = process.env.JWT_SECRET || "fallback_secret_key_123";

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ===================== MULTER ===================== */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* ===================== ROOMS ===================== */
app.post('/api/rooms', upload.single('image'), async (req, res) => {
    try {
        const newRoom = new Room({
            roomNumber: req.body.roomNumber,
            type: req.body.type,
            price: req.body.price,
            image: req.file ? req.file.filename : null
        });

        await newRoom.save();

        res.status(201).json({ message: "Room added successfully" });

    } catch (err) {
        res.status(500).json({
            message: "Error adding room",
            error: err.message
        });
    }
});

app.get('/api/rooms', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

app.get('/api/rooms/:id', async (req, res) => {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
});

/* ===================== BOOKING ===================== */
app.post('/api/book', authMiddleware, async (req, res) => {
    const { roomId, guestName, checkIn, checkOut } = req.body;

    const room = await Room.findById(roomId);
    if (!room || room.isBooked) return res.status(400).send("Room not available");

    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * room.price;

    const reservation = new Reservation({
        userId: req.user.id,
        roomId,
        guestName,
        checkIn,
        checkOut,
        totalPrice
    });

    await reservation.save();
    await Room.findByIdAndUpdate(roomId, { isBooked: true });

    res.json(reservation);
});

/* ===================== USER ===================== */
app.get('/api/user/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
});

/* ===================== RESERVATIONS ===================== */
app.get('/api/my-bookings', authMiddleware, async (req, res) => {
    const bookings = await Reservation.find({ userId: req.user.id }).populate('roomId');
    res.json(bookings);
});

app.delete('/api/reservations/:id', authMiddleware, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: "الطلب غير موجود" });

        // نرجع الغرفة متاحة تاني قبل ما نمسح الحجز
        await Room.findByIdAndUpdate(reservation.roomId, { isBooked: false });
        
        await Reservation.findByIdAndDelete(req.params.id);
        res.json({ message: "تم إلغاء الحجز بنجاح" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ===================== START SERVER ===================== */
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));