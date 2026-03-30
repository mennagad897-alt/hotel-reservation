import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    guestName: String,
    checkIn: Date,
    checkOut: Date,
    totalPrice: Number
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;