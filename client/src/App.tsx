import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PillNav from './components/PillNav';
import BlobCursor from './components/BlobCursor';
import TypewriterBanner from './components/TypewriterBanner';
import Loader from './components/Loader';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [balance, setBalance] = useState(12450.00);
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Standard Chartered', amount: -1200.00, date: '2026.02.10', status: 'SETTLED' },
    { id: 2, name: 'Node Yield', amount: 450.00, date: '2026.02.12', status: 'VERIFIED' }
  ]);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <Router>
      <div className="relative min-h-screen bg-transparent">
      <div className="bg-architecture" />
        <BlobCursor />
        
        <PillNav isAuthenticated={isAuthenticated} />

        <main className="relative z-10">
          <Routes>
            {/* FIXED: Passing isAuthenticated to LandingPage */}
            <Route 
              path="/" 
              element={<LandingPage isAuthenticated={isAuthenticated} />} 
            />
            
            <Route 
              path="/login" 
              element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} 
            />
            
            <Route 
              path="/register" 
              element={<RegisterPage setIsAuthenticated={setIsAuthenticated} />} 
            />
            
            <Route path="/dashboard" element={
              isAuthenticated ? (
                <Dashboard 
                  balance={balance} 
                  transactions={transactions} 
                  setTransactions={setTransactions} 
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
            
            <Route path="/send" element={
              isAuthenticated ? (
                <SendMoney 
                  balance={balance} 
                  setBalance={setBalance} 
                  setTransactions={setTransactions} 
                />
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </main>

        <TypewriterBanner />
      </div>
    </Router>
  );
}

export default App;