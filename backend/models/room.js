const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Room', roomSchema);