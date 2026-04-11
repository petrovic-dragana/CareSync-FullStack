import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Ovde ćemo kasnije dodati rute za Dashboard-e */}

          <Route path="/doctor-dashboard" element={<h1>Dobrodošao, Doktore!</h1>} />
          <Route path="/nurse-dashboard" element={<h1>Dobrodošla, Sestro!</h1>} />
        </Routes>
      </Router>
  );
}

export default App;
