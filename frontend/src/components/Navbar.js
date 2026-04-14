import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 50px', backgroundColor: '#fff', borderBottom: '1px solid #eee', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontWeight: 'bold', fontSize: '22px', color: '#2d6cdf', display: 'flex', alignItems: 'center' }}>
                💙 CareSync
            </div>
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                {/* POČETNA - Sakrivena za Admina */}
                {role !== 'ROLE_ADMIN' && (
                    <Link to={role === 'ROLE_DOCTOR' ? "/doctor-dashboard" : "/nurse-dashboard"} style={{ textDecoration: 'none', color: '#444', fontWeight: '500' }}>🏠 Početna</Link>
                )}
                {/* LINKOVI SAMO ZA SESTRU */}
                {role === 'ROLE_NURSE' && (
                    <>
                        <Link to="/doctors-list" style={{ textDecoration: 'none', color: '#444' }}>👨‍⚕️ Lekari</Link>
                        <Link to="/appointments" style={{ textDecoration: 'none', color: '#444' }}>📅 Zakazivanje</Link>
                        <Link to="/appointments-list" style={{ textDecoration: 'none', color: '#555' }}>
                            📅 Termini
                        </Link>
                        <Link to="/billing" style={{ textDecoration: 'none', color: '#444' }}>💳 Naplata</Link>
                    </>
                )}

                {/* LINKOVI SAMO ZA DOKTORA */}
                {role === 'ROLE_DOCTOR' && (
                    <>
                        <Link to="/waiting-room" style={{ textDecoration: 'none', color: '#444' }}>📋 Čekaonica</Link>
                    </>
                )}
                {role === 'ROLE_ADMIN' && (
                    <>
                        <Link to="/admin-dashboard" style={{ textDecoration: 'none', color: '#444' }}>🛡️ Admin Panel</Link>
                        <Link to="/doctors-list" style={{ textDecoration: 'none', color: '#444' }}>👥 Korisnici</Link>
                    </>
                )}

                <button onClick={handleLogout} style={{ marginLeft: '20px', padding: '8px 15px', backgroundColor: '#fff', border: '1px solid red', color: 'red', borderRadius: '5px', cursor: 'pointer' }}>
                    Odjavi se
                </button>
            </div>
        </nav>
    );
};

export default Navbar;