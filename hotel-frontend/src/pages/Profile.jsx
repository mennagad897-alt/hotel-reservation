import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosConfig";

const Profile = () => {
  const { user } = useContext(AuthContext); // بناخد بيانات اليوزر من الـ Context
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/user/profile");
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20 text-indigo-600">Loading Profile...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* هيدر البروفايل مع لون الـ Indigo */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-800 h-32 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-indigo-600">
                {user?.username?.charAt(0).toUpperCase()}
            </div>
        </div>

        <div className="p-8 pt-16 text-center">
          <h2 className="text-3xl font-extrabold text-indigo-900 mb-1">{user?.username}</h2>
          <p className="text-gray-500 mb-8">{user?.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs text-indigo-500 font-bold uppercase mb-1">Account Status</p>
              <p className="text-gray-800 font-medium">Verified Member</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-xs text-indigo-500 font-bold uppercase mb-1">Member Since</p>
              <p className="text-gray-800 font-medium">March 2026</p>
            </div>
          </div>

          <button className="mt-10 px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300">
            Edit Profile Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;