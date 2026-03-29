require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Reservation = require('./models/Reservation');
const app = express();
const cors = require('cors');
app.use(cors()); 
app.use(express.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Database Connection using environment variable
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_reservation_db';

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Connection error:', err));

app.post('/api/signup', async function(req, res) {
    try {
        const { username, email, password } = req.body;

        console.log("Password received in Signup:", password);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Password after hashing:", hashedPassword);

        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });

        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        console.error(err); 
        res.status(400).json({ message: err.message });
    }
});

app.post('/api/login', async function(req, res) {
    try {
        const { email, password } = req.body;
        
        console.log("--- محاولة تسجيل دخول ---");
        console.log("الإيميل المبعوث:", email);

        // 1. البحث عن المستخدم
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("النتيجة: الإيميل مش موجود");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2. مقارنة الباسورد الهاش
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("هل الباسورد متطابق؟:", isMatch);

        if (!isMatch) {
            console.log("النتيجة: الباسورد غلط");
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. توليد التوكن (الجزء اللي كان فيه الشك)
        // بنستخدم سر احتياطي في حالة لو ملف الـ .env فيه مشكلة
        const secretKey = process.env.JWT_SECRET || "fallback_secret_key_123";

        const token = jwt.sign(
            { id: user._id }, 
            secretKey, 
            { expiresIn: '1h' }
        );

        console.log("تم توليد التوكن بنجاح! 🔑");

        // 4. إرسال الرد النهائي
        res.json({
            token: token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            }
        });

    } catch (err) {
        // لو حصل أي خطأ في أي خطوة فوق، هيظهر هنا بالتفصيل في الترمينال
        console.error("خطأ مفصل في السيرفر:", err.message);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

app.post('/api/rooms', async (req, res) => {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json({ message: "Room added successfully" });
});

app.get('/api/rooms', async (req, res) => {
    try {
        const rooms = await Room.find(); // بيجيب كل الغرف من المونجو
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ message: "Error fetching rooms" });
    }
});

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

async function authMiddleware(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "لم يتم العثور على توكن، الدخول غير مصرح به" });
    }

    try {
        const decoded = jwt.verify(token, "process.env.JWT_SECRET");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "التوكن غير صالح" });
    }
}

app.get('/api/user/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
 



