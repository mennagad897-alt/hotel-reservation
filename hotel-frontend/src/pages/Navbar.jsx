import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-black tracking-tighter">
          LUXE<span className="text-indigo-400">HOTEL</span>
        </Link>

        <div className="flex items-center gap-6 font-medium">
          <Link title="Home" to="/rooms" className="hover:text-indigo-300 transition">Rooms</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="hover:text-indigo-300 transition">My Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-bold transition shadow-md"
              >
                Logout
              </button>
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-indigo-300 font-bold uppercase">
                {user.username?.charAt(0)}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-300 transition">Login</Link>
              <Link 
                to="/signup" 
                className="bg-white text-indigo-900 px-5 py-2 rounded-xl font-bold hover:bg-indigo-100 transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
