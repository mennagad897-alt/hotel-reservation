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