import { useNavigate } from "react-router-dom";

const Rooms = ({ room }) => {
  const navigate = useNavigate(); 

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <img 
        src={room.image || 'https://via.placeholder.com/400x250'} 
        alt={room.title} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-indigo-900 mb-2">{room.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-extrabold text-indigo-600">${room.price}<span className="text-sm text-gray-400">/night</span></span>
          
          <button 
            onClick={() => navigate(`/room/${room._id}`)} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md active:scale-95 duration-200"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
