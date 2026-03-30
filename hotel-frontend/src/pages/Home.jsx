import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <div 
        className="h-[90vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945')"
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative text-center px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            Welcome to LuxHotel
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover luxury, comfort, and unforgettable experiences. 
            Book your perfect stay with ease.
          </p>

          <button
            onClick={() => navigate("/rooms")}
            className="bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
          >
            Explore Rooms
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-10">
          Why Choose Us?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-3">Luxury Rooms</h3>
            <p className="text-gray-600">
              Fully equipped rooms designed for comfort and elegance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-3">Easy Booking</h3>
            <p className="text-gray-600">
              Book your room in seconds with a smooth experience.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold mb-3">Best Prices</h3>
            <p className="text-gray-600">
              Enjoy premium service at the best possible rates.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-900 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Book Your Stay?
        </h2>
        <p className="mb-6">
          Start your journey with us today.
        </p>

        <button
          onClick={() => navigate("/rooms")}
          className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
        >
          Book Now
        </button>
      </div>

    </div>
  );
};

export default Home;