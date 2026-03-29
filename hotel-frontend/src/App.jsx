import Navbar from "./Pages/Navbar";
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
             <Navbar /> 
      <main className="min-h-screen bg-gray-50">
        <AppRoutes />
      </main>
            </Router>
        </AuthProvider>
    );
}

export default App; 
