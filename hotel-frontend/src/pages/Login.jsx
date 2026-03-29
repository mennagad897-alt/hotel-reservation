import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext"; // تأكدي من المسار

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState("");
    const { login } = useContext(AuthContext); // بننادي على دالة الـ login من الـ Context

    const onSubmit = async (data) => {
        try {
            setServerError("");
            // 1. نبعت الإيميل والباسورد للـ Node.js
            const response = await API.post("/login", data);
            
            if (response.status === 200) {
                // 2. لو تمام، ناخد التوكن واليوزر ونخزنهم في الـ Context والـ LocalStorage
                const { token, user } = response.data;
                login(user, token); 
                
                alert("Welcome back!");
                navigate("/Home"); // نوديه للهوم
            }
        } catch (err) {
            setServerError(err.response?.data?.message || "Invalid email or password");
        }
    };

   return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-50">
      {/* الكارط الرئيسي بنفس ستايل الـ Register */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        
        {/* العنوان بلون Indigo وفخم */}
        <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Please enter your details to login</p>
        
        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* حقل الإيميل */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:bg-white'
              }`}
              placeholder="menna@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          {/* حقل الباسورد */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:bg-white'
              }`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
          </div>

         
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 mt-4"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Don't have an account? 
          <Link to="/signup" className="text-indigo-600 font-bold hover:underline ml-1">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;