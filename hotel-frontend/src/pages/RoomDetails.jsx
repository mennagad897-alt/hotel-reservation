import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

function RoomDetails() {
    const { id } = useParams(); 
    const [room, setRoom] = useState(null);
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();

    useEffect(function() {
        async function fetchRoom() {
            try {
                // التأكد من أن الرابط يطابق الـ Backend
                const response = await API.get(`/rooms/${id}`);
                setRoom(response.data);
            } catch (error) {
                console.error("Error fetching room details", error);
            }
        }
        fetchRoom();
    }, [id]);

 async function handleBooking() {
    if (!user) {
        alert("Please login first to book this room!");
        navigate("/login");
        return;
    }
    
    try {
        await API.post("/book", {
            roomId: id,
            guestName: user.username,
            checkIn: new Date(),
            checkOut: new Date(Date.now() + 86400000) // يوم واحد
        });

        alert(`Success! Room ${room.roomNumber} has been booked.`);
        navigate("/Home");
    } catch (error) {
        console.error(error); // مهم جدًا
        alert("Booking failed. Please try again.");
    }
}

    if (!room) return <div className="text-center py-20 text-indigo-600 font-bold">Loading room details...</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12 bg-white p-6 rounded-3xl shadow-xl border border-gray-50">
                <div className="lg:w-1/2">
                    <img 
                        src={room.image || 'https://via.placeholder.com/800x500'} 
                        className="w-full h-[400px] object-cover rounded-2xl shadow-md"
                        alt={room.roomNumber}
                    />
                </div>

                <div className="lg:w-1/2 flex flex-col justify-between py-2">
                    <div>
                        {/* هنا غيرنا title لـ roomNumber */}
                        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 text-left">Room {room.roomNumber}</h1>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                {room.type}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className={room.isBooked ? "text-red-500 font-bold" : "text-green-600 font-bold"}>
                                {room.isBooked ? "Occupied" : "Available Now"}
                            </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-8 text-lg text-left">
                            Experience luxury in our {room.type} suite. Equipped with modern amenities for a comfortable stay.
                        </p>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-left">
                                <p className="text-gray-400 text-sm">Price per night</p>
                                <span className="text-4xl font-black text-indigo-600">${room.price}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleBooking}
                            disabled={room.isBooked}
                            className={`w-full py-4 text-white text-xl font-bold rounded-2xl shadow-lg transition-all ${room.isBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-800 hover:scale-[1.02]'}`}
                        >
                            {room.isBooked ? "Already Booked" : "Confirm Booking"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RoomDetails;