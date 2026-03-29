const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    isBooked: { type: Boolean, default: false },
    image: { 
        type: String, 
        required: false,
        default: "https://via.placeholder.com/300" 
    }
});

module.exports = mongoose.model('Room', roomSchema);