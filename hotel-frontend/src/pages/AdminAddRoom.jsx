import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../api/axiosConfig';

function AdminAddRoom() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleRoomSubmit(data) {
        try {
            setIsLoading(true);
            setStatusMessage("");
            
            // Sending data to the POST /api/rooms endpoint
            const response = await API.post('/rooms', data);
            
            if (response.status === 200 || response.status === 201) {
                setStatusMessage("✅ Success: Room added to the database!");
                reset(); // Clears the form
            }
        } catch (err) {
            console.error("Error adding room:", err);
            setStatusMessage("❌ Failed: Could not save the room.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Admin Panel: Add Room</h2>
                
                {statusMessage && (
                    <div className={`p-3 rounded-md mb-4 text-center text-sm ${statusMessage.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {statusMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit(handleRoomSubmit)} className="space-y-4">
                    {/* Room Name/Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Name/Number</label>
                        <input 
                            type="text"
                            {...register("roomNumber", { required: "Required" })}
                            placeholder="e.g., Deluxe 302"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Room Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select 
                            {...register("type", { required: "Required" })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price per Night ($)</label>
                        <input 
                            type="number"
                            {...register("price", { required: "Required" })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-700 text-white py-2 rounded-md hover:bg-blue-800 transition disabled:bg-gray-400"
                    >
                        {isLoading ? "Processing..." : "Save Room"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AdminAddRoom;