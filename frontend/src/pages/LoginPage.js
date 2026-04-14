import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role) {
            redirectBasedOnRole(role);
        }
    }, []);

    const redirectBasedOnRole = (role) => {
        const path = role === 'ROLE_DOCTOR' ? '/doctor-dashboard' :
            role === 'ROLE_NURSE' ? '/nurse-dashboard' : '/admin-dashboard';
        navigate(path, { replace: true });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await authService.login(username, password);

            // 1. Proveravamo da li backend kaže da lozinka mora da se menja
            if (data.mustChangePassword) {
                navigate('/change-password'); // Šaljemo ga na novu stranicu
            }else{
                redirectBasedOnRole(data.role);
            }

        } catch (err) {
            setError('Neispravno korisničko ime ili lozinka. Pokušajte ponovo.');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={logoSectionStyle}>
                    <span style={{ fontSize: '40px', marginBottom: '10px' }}>💙</span>
                    <h1 style={titleStyle}>CareSync</h1>
                    <p style={subtitleStyle}>Dobro došli nazad! Molimo ulogujte se na svoj nalog.</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Korisničko ime</label>
                        <input
                            type="text"
                            placeholder="Unesite korisničko ime"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={inputFieldStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Lozinka</label>
                        <input
                            type="password"
                            placeholder="Unesite lozinku"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={inputFieldStyle}
                            required
                        />
                    </div>

                    {error && <div style={errorBoxStyle}>{error}</div>}

                    <button
                        type="submit"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            ...buttonStyle,
                            backgroundColor: isHovered ? '#1a56b8' : '#2d6cdf',
                            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)'
                        }}
                    >
                        Prijavi se
                    </button>
                </form>

                <div style={footerStyle}>
                    <p>© 2026 CareSync • Medicinski informacioni sistem</p>
                </div>
            </div>
        </div>
    );
};

// --- MODERNI STILOVI ---

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f7fe', // Blago plavičasta pozadina
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
};

const cardStyle = {
    backgroundColor: '#fff',
    padding: '50px 40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center'
};

const logoSectionStyle = {
    marginBottom: '40px'
};

const titleStyle = {
    fontSize: '32px',
    color: '#1a2b4b',
    margin: '0',
    fontWeight: '700',
    letterSpacing: '-0.5px'
};

const subtitleStyle = {
    color: '#666',
    fontSize: '14px',
    marginTop: '10px'
};

const inputGroupStyle = {
    textAlign: 'left',
    marginBottom: '20px'
};

const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#444',
    marginBottom: '8px',
    marginLeft: '4px'
};

const inputFieldStyle = {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    backgroundColor: '#fcfcfc'
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(45, 108, 223, 0.3)'
};

const errorBoxStyle = {
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '20px',
    border: '1px solid #feb2b2'
};

const footerStyle = {
    marginTop: '40px',
    fontSize: '12px',
    color: '#aaa'
};

export default LoginPage;