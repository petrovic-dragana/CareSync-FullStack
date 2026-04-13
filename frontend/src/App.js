import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NurseDashboard from "./pages/NurseDashboard";
import DoctorDashboard from "./pages/DoctorDasboard";
import PatientDetail from './pages/PatientDetail';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Ovde ćemo kasnije dodati rute za Dashboard-e */}

          <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
          <Route path="/nurse-dashboard" element={<NurseDashboard/>} />
          <Route path="/patient-detail/:id" element={<PatientDetail />} />
        </Routes>
      </Router>
  );
}

export default App;
