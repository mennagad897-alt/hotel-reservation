import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import RoomCard from "../Pages/RoomCard";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await API.get("/rooms");
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <div className="text-center mt-20 text-indigo-600 font-bold">Loading Rooms...</div>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-indigo-900 mb-8 text-center">Our Luxury Rooms</h1>
      
      {/* الشبكة (Grid) اللي هتعرض الغرف */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Home;