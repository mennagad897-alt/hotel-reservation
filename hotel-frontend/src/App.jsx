import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                {/* لو عندك Navbar حطيها هنا عشان تظهر في كل الصفحات */}
                <div className="container mx-auto p-4">
                    <AppRoutes />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;