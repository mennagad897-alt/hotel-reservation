import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

const RoomDetails = () => {
    const { id } = useParams(); 
    const [room, setRoom] = useState(null);
    const { user } = useContext(AuthContext); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await API.get(`/rooms/${id}`);
                setRoom(response.data);
            } catch (error) {
                console.error("Error fetching room details", error);
            }
        };
        fetchRoom();
    }, [id]);

    const handleBooking = () => {
        if (!user) {
            alert("Please login first to book this room!");
            navigate("/login");
            return;
        }
        alert(`Booking request sent for ${room.title}`);
    };

    if (!room) return <div className="text-center py-20 text-indigo-600">Loading details...</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-12 bg-white p-6 rounded-3xl shadow-xl border border-gray-50">
                
                <div className="lg:w-1/2">
                    <img 
                        src={room.image || 'https://via.placeholder.com/800x500'} 
                        className="w-full h-[400px] object-cover rounded-2xl shadow-md"
                        alt={room.title}
                    />
                </div>

                <div className="lg:w-1/2 flex flex-col justify-between py-2">
                    <div>
                        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">{room.title}</h1>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                {room.type || 'Luxury'}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-green-600 font-semibold">Available Now</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                            {room.description || "Enjoy a premium stay with all luxury facilities. Our rooms are designed for comfort and peace."}
                        </p>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-gray-400 text-sm">Price per night</p>
                                <span className="text-4xl font-black text-indigo-600">${room.price}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleBooking}
                            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-800 text-white text-xl font-bold rounded-2xl shadow-lg hover:scale-[1.02] transition-all"
                        >
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default RoomDetails;
