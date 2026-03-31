import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axiosConfig";

const Profile = () => {
const { Login } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [showReservations, setShowReservations] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/user/profile");
        setProfileData(res.data);
      } catch (error) {
        console.error("Profile Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 2. دالة جلب الحجوزات (تم تعديل المسار ليتوافق مع السيرفر)
  const fetchReservations = async () => {
    // إذا كانت الحجوزات معروضة بالفعل، نقوم بإخفائها (Toggle)
    if (showReservations) {
      setShowReservations(false);
      return;
    }

    setLoadingReservations(true);

    try {
   
      // تم تغيير المسار من /reservations/my إلى /my-bookings ليطابق السيرفر
      const res = await API.get("/my-bookings");
      setReservations(res.data);
      setShowReservations(true);
    } catch (error) {
      console.error("Reservations Error:", error);
      alert("Failed to load reservations. Please try again.");
    } finally {
      setLoadingReservations(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-indigo-600 font-bold">
        Loading Profile...
      </div>
    );
  }

  const handleCancel = async (id) => {
  if (window.confirm("Are you sure you want to cancel this reservation?")) {
    try {
      await API.delete(`/reservations/${id}`);
      setReservations(reservations.filter(r => r._id !== id));
      alert("Reservation cancelled successfully");
    } catch (error) {
      console.error("Delete Error:", error);
    }
  }
};

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-indigo-600 h-32 flex items-center justify-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-indigo-500 shadow-lg">
            {profileData?.username?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* User Info Content */}
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {profileData?.username}
          </h2>
          <p className="text-gray-500 mb-6">{profileData?.email}</p>

          <hr className="my-6 border-gray-100" />

          {/* Reservations Button */}
          <button
            onClick={fetchReservations}
            disabled={loadingReservations}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md 
              ${showReservations 
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300" 
                : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
              }`}
          >
            {loadingReservations ? "Loading..." : showReservations ? "Hide Reservations" : "Show My Reservations"}
          </button>

          {/* Reservations List Section */}
          {showReservations && (
            <div className="mt-8 text-left animate-fade-in">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-2 h-6 bg-indigo-600 rounded-full mr-2"></span>
                My Reservations:
              </h3>

              {reservations.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-2xl text-center text-gray-500 italic">
                  No reservations found yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res._id}
                      className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          {/* تم تغيير roomId.name إلى roomId.roomNumber و roomId.type */}
                          <p className="font-bold text-indigo-900 text-lg">
                            Room #{res.roomId?.roomNumber || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500 capitalize">
                            Type: {res.roomId?.type || "Standard"}
                          </p>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                          ${res.totalPrice}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm border-t border-gray-50 pt-3">
                        <div>
                          <p className="text-gray-400 text-xs uppercase font-semibold">Check-In</p>
                          <p className="text-gray-700 font-medium">
                            {new Date(res.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs uppercase font-semibold">Check-Out</p>
                          <p className="text-gray-700 font-medium">
                            {new Date(res.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button 
  onClick={() => handleCancel(res._id)}
  className="mt-2 text-red-600 font-bold hover:text-red-800 text-sm"
>
  Cancel Reservation
</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;