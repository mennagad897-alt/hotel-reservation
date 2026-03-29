import React from 'react';
import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={room.image || 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500'} 
          alt={room.roomNumber} 
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-1 rounded-full font-bold shadow-lg">
          ${room.price}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-gray-800">Room {room.roomNumber}</h3>
          <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${room.isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {room.isBooked ? 'Occupied' : 'Available'}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-6 italic">{room.type} Luxury Suite</p>
        
        <Link 
          to={`/room/${room._id}`} 
          className="block text-center bg-indigo-900 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
        >
          View & Book Now
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
