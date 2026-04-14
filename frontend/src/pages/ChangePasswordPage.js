import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ChangePasswordPage = () => {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError('Lozinke se ne podudaraju!');
            return;
        }

        if (passwords.newPassword.length < 6) {
            setError('Lozinka mora imati barem 6 karaktera.');
            return;
        }

        try {
            // Šaljemo novu lozinku na backend
            await api.post('/auth/update-password', {
                newPassword: passwords.newPassword
            });

            alert('Lozinka uspešno promenjena! Molimo ulogujte se ponovo.');
            localStorage.clear(); // Brišemo privremeni token
            navigate('/login');
        } catch (err) {
            setError('Greška pri promeni lozinke. Pokušajte ponovo.');
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={titleStyle}>🔒 Promena lozinke</h2>
                <p style={subtitleStyle}>Ovo je vaš prvi login. Molimo vas da postavite novu, sigurnu lozinku.</p>

                <form onSubmit={handleSubmit}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Nova lozinka</label>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Unesite novu lozinku"
                            onChange={handleChange}
                            style={inputFieldStyle}
                            required
                        />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Potvrdite lozinku</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Ponovite lozinku"
                            onChange={handleChange}
                            style={inputFieldStyle}
                            required
                        />
                    </div>

                    {error && <div style={errorBoxStyle}>{error}</div>}

                    <button type="submit" style={buttonStyle}>
                        Sačuvaj lozinku
                    </button>
                </form>
            </div>
        </div>
    );
};

// Stilovi (usklađeni sa tvojim Login-om)
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f4f7fe' };
const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', textAlign: 'center' };
const titleStyle = { color: '#1a2b4b', marginBottom: '10px' };
const subtitleStyle = { color: '#666', fontSize: '14px', marginBottom: '30px' };
const inputGroupStyle = { textAlign: 'left', marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '8px' };
const inputFieldStyle = { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e0e0e0', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '14px', backgroundColor: '#2d6cdf', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const errorBoxStyle = { backgroundColor: '#fff5f5', color: '#e53e3e', padding: '10px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #feb2b2' };

export default ChangePasswordPage;