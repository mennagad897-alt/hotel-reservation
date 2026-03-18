const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Room = require('./models/Room');
const Reservation = require('./models/Reservation');

const app = express();
app.use(express.json());

// الاتصال بقاعدة البيانات
mongoose.connect('mongodb://127.0.0.1:27017/hotel_reservation_db')
    .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح! 🏨'))
    .catch(err => console.error('خطأ في الاتصال:', err));

// --- [ 1. نظام الحسابات (Auth) ] ---

// تسجيل مستخدم جديد
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: "تم إنشاء الحساب بنجاح! 🎉" });
    } catch (err) {
        res.status(400).json({ message: "الإيميل ده موجود قبل كده!" });
    }
});

// تسجيل الدخول
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password }); // بندور على الإيميل والباسورد مع بعض
    
    if (user) {
        res.json({ message: `أهلاً يا ${user.username}، نورتي الفندق! ✨` });
    } else {
        res.status(401).json({ message: "الإيميل أو الباسورد غلط ❌" });
    }
});

// --- [ 2. عمليات الغرف (Rooms CRUD) ] ---

// إضافة غرفة جديدة (عشان الأدمن)
app.post('/api/rooms', async (req, res) => {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.json({ message: "تم إضافة الغرفة بنجاح" });
});

// عرض كل الغرف
app.get('/api/rooms', async (req, res) => {
    const rooms = await Room.find();
    res.json(rooms);
});

// --- [ 3. عمليات الحجز (Booking CRUD) ] ---

// إنشاء حجز جديد
app.post('/api/book', async (req, res) => {
    const { roomId, guestName, checkIn, checkOut } = req.body;
    
    // حساب السعر وتحديث حالة الغرفة
    const room = await Room.findById(roomId);
    if (!room || room.isBooked) return res.status(400).send("الغرفة غير متاحة");

    const days = Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * room.price;

    const reservation = new Reservation({ roomId, guestName, checkIn, checkOut, totalPrice });
    await reservation.save();
    
    await Room.findByIdAndUpdate(roomId, { isBooked: true }); // تغيير الحالة لمحجوزة
    res.status(201).json({ message: "تم الحجز بنجاح ✅", details: reservation });
});

// حذف حجز (إلغاء)
app.delete('/api/book/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).send("الحجز مش موجود");

    await Room.findByIdAndUpdate(reservation.roomId, { isBooked: false }); // رجعنا الغرفة متاحة تاني
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "تم إلغاء الحجز بنجاح والغرفة بقت فاضية" });
});

// تحديث حجز
app.put('/api/book/:id', async (req, res) => {
    const updatedRes = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "تم تحديث البيانات", updatedRes });
});

// إضافة الـ Route ده عشان نقدر نشوف كل الحجوزات وناخد الـ ID بتاعها
app.get('/api/book', async (req, res) => {
    try {
        const allReservations = await Reservation.find().populate('roomId');
        res.json(allReservations);
    } catch (err) {
        res.status(500).json({ message: "حصل مشكلة وأنا بجيب الحجوزات" });
    }
});
// تشغيل السيرفر
app.listen(3000, () => console.log('Server running on http://localhost:3000 🚀'));