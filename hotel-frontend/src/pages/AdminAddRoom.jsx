import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../api/axiosConfig';
import { Navigate } from "react-router-dom";

function AdminAddRoom() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // افترضنا إنك بتخزني الـ role هنا

    // حماية الصفحة: لو مفيش توكن أو المستخدم مش Admin
    if (!token || userRole !== "admin") {
        return <Navigate to="/login" />;
    }

    async function handleRoomSubmit(data) {
        try {
            setIsLoading(true);
            setStatusMessage("");

            // 1. استخدام FormData لرفع الملفات
            const formData = new FormData();
            formData.append("roomNumber", data.roomNumber);
            formData.append("type", data.type);
            formData.append("price", data.price);
            
            // إضافة الصورة (بناخد أول ملف في المصفوفة)
            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }

            // 2. إرسال الطلب مع الـ Headers المناسبة
            const response = await API.post('/rooms', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // تأكدي من إرسال التوكن
                }
            });

            if (response.status === 200 || response.status === 201) {
                setStatusMessage("✅ Success: Room added with image!");
                reset();
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Name/Number</label>
                        <input 
                            type="text"
                            {...register("roomNumber", { required: "Required" })}
                            placeholder="e.g., Deluxe 302"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select {...register("type", { required: "Required" })} className="w-full mt-1 p-2 border border-gray-300 rounded-md">
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Price per Night ($)</label>
                        <input 
                            type="number"
                            {...register("price", { required: "Required" })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* حقل رفع الصورة الجديد */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Room Image</label>
                        <input 
                            type="file"
                            accept="image/*"
                            {...register("image", { required: "Image is required" })}
                            className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
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