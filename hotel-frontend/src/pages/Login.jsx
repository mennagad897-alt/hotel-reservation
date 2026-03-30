import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import API from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { login } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      setServerError("");

      // إرسال طلب تسجيل الدخول
      // تأكدي أن baseURL في axiosConfig ينتهي بـ /api ليكون المسار النهائي /api/login
      const response = await API.post("/login", data);

      if (response.data && response.data.token) {
        const { token, user } = response.data;

        // 1. التخزين في localStorage أولاً (مهم جداً للـ Interceptor)
        localStorage.setItem("token", token);
        localStorage.setItem("role", user.role);

        // 2. تحديث الـ Context الخاص بالتطبيق
        login(user, token);

        // 3. التوجيه بناءً على الرول
        if (user.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      // عرض رسالة الخطأ القادمة من السيرفر
      setServerError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        
        <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Please enter your details to login</p>
        
        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100 italic">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
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

          {/* Password Field */}
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