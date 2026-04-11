import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await authService.login(username, password);

            // Preusmeravanje na osnovu uloge
            if (data.role === 'ROLE_DOCTOR') {
                navigate('/doctor-dashboard');
            } else if (data.role === 'ROLE_NURSE') {
                navigate('/nurse-dashboard');
            } else {
                navigate('/admin-dashboard');
            }
        } catch (err) {
            setError('Neispravno korisničko ime ili lozinka');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
            <h2>CareSync Login</h2>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Korisničko ime"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="password"
                        placeholder="Lozinka"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
                    Prijavi se
                </button>
            </form>
        </div>
    );
};

export default LoginPage;