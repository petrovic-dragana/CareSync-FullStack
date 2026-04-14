import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import NurseDashboard from "./pages/NurseDashboard";
import DoctorDashboard from "./pages/DoctorDasboard";
import PatientDetail from './pages/PatientDetail';
import Navbar from "./components/Navbar";
import ScheduleAppointment from "./pages/ScheduleAppointment";
import AllAppointments from "./pages/AllAppointments";
import Billing from "./pages/Billing";
import DoctorsList from "./pages/DoctorsList";
import WaitingRoom from "./pages/WaitingRoom";
import DoctorStats from "./pages/DoctorStats";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const ConditionalNavbar = () => {
    const location = useLocation();
    const hideNavbarPaths = ['/', '/login'];
    if (hideNavbarPaths.includes(location.pathname)) {
        return null;
    } return <Navbar />;
}
function App() {
  return (
      <Router>
          <ConditionalNavbar />
          <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard/>} />
          <Route path="/nurse-dashboard" element={<NurseDashboard/>} />
          <Route path="/patient-detail/:id" element={<PatientDetail />} />
          <Route path="/appointments" element={<ScheduleAppointment />} />
          <Route path="/appointments-list" element={< AllAppointments />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/doctors-list" element={<DoctorsList />} />
              <Route path="/waiting-room" element={<WaitingRoom />} />
              <Route path="/doctor-stats" element={<DoctorStats />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
          </Routes>
      </Router>
  );
}

export default App;
