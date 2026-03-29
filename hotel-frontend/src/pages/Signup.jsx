import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosConfig";
import { useState } from "react";
// 1. استيراد المكتبات الجديدة
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 2. تعريف الـ Schema (قواعد البيانات اللي Zod هيفتش عليها)
const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name is too long"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  // 3. ربط الـ Schema بـ React Hook Form باستخدام الـ resolver
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

const onSubmit = async (data) => {
    try {
      setServerError("");
      console.log("Data being sent:", data); // عشان نتأكد إن Zod مطلع البيانات صح
      
      const response = await API.post("/signup", data);
      console.log("Response from server:", response);

      if (response.status === 201 || response.status === 200) {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      // السطر ده هيخلينا نشوف المشكلة فين بالظبط في الكونسول
      console.error("Full Error Object:", err);
      setServerError(err.response?.data?.message || "Check console for more details.");
    }
};

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        
        <h2 className="text-3xl font-extrabold text-center text-indigo-900 mb-2">Create Account</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">Join our luxury hotel community today</p>
        
        {serverError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* حقل الاسم - شيلنا الـ required والـ pattern يدوي لأن Zod بيقوم بالواجب */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Full Name</label>
            <input
              type="text"
              {...register("username")}
              className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.username ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:bg-white'
              }`}
              placeholder="Menna Ahmed"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1 ml-1">{errors.username.message}</p>}
          </div>

          {/* حقل الإيميل */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              {...register("email")}
              className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-indigo-500 focus:bg-white'
              }`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
          </div>

          {/* حقل الباسورد */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1">Password</label>
            <input
              type="password"
              {...register("password")}
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
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-8 text-sm">
          Already have an account? 
          <Link to="/login" className="text-indigo-600 font-bold hover:underline ml-1">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;