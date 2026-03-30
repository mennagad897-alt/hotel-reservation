import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import RoomCard from "../pages/RoomCard";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    console.log("Fetching rooms...");
    
    async function fetchRooms() {
      try {
        const res = await API.get("/rooms");
        setRooms(res.data);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    }

    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
        Available Rooms
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
}

export default Rooms;