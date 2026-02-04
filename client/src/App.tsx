import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import SenderDetails from './pages/SenderDetails';
import ReceiverDetails from './pages/ReceiverDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/send" element={<SendMoney />} />
                <Route path="/sender-details" element={<SenderDetails />} />
                <Route path="/receiver-details" element={<ReceiverDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
