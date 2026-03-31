import { useState } from "react";
import API from "../api/axiosConfig";

const AdminManageUsers = () => {
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    role: "user" 
  });
  const [message, setMessage] = useState("");

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await API.post("/signup", formData);
      setMessage("✅ Success: User created successfully!");
      setFormData({ username: "", email: "", password: "", role: "user" });
    } catch (err) {
      console.error("Error details:", err);
      setMessage("❌ Error: Could not create user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-black text-indigo-900 mb-6 text-center">User Management</h2>
        
        {message && (
          <div className={`p-4 rounded-lg mb-6 text-center font-bold ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleAddUser} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none transition"
              placeholder="Enter full name"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none transition"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border-2 border-gray-100 rounded-xl focus:border-indigo-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">User Role</label>
            <select 
              className="w-full p-3 border-2 border-gray-100 rounded-xl bg-gray-50 focus:border-indigo-500 outline-none transition font-medium"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User (Customer)</option>
              <option value="employee">Employee (Staff)</option>
              <option value="admin">Admin (Manager)</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition shadow-lg transform hover:-translate-y-1">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminManageUsers;