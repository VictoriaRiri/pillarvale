import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage'; // Import the new page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-white/20">
        {/* Background Layer */}
        <div className="bg-architecture" />
        
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage isAuthenticated={isAuthenticated} />} />

          {/* The New About Route */}
          <Route path="/about" element={<AboutPage />} />

          {/* Auth Routes: Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegisterPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/dashboard" />} 
          />

          {/* Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
