import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {useNavigate} from "react-router-dom";

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                // Koristimo tvoj postojeći endpoint
                const res = await api.get('/users/doctors');
                setDoctors(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Greška pri učitavanju lekara:", err);
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Logika za filtriranje: proveravamo ime, prezime i specijalizaciju
    const filteredDoctors = doctors.filter(dr => {
        const search = searchTerm.toLowerCase();
        return(
            dr.firstName.toLowerCase().includes(search) ||
            dr.lastName.toLowerCase().includes(search) ||
            dr.specialization.toLowerCase().includes(search)
        );
    });
    if (loading) return <div style={{ padding: '40px' }}>Učitavanje liste lekara...</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ color: '#1a2b4b', marginBottom: '5px' }}>👨‍⚕️ Naš medicinski tim</h2>
                    <p style={{ color: '#666' }}>Pregled svih lekara i njihovih specijalizacija.</p>
                </div>

                {/* --- INPUT ZA PRETRAGU --- */}
                <input
                    type="text"
                    placeholder="Pretraži po imenu ili specijalizaciji..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={searchInputStyle}
                />
            </div>

            <hr style={{ opacity: '0.1', marginBottom: '30px' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(dr => (
                        <div key={dr.id} style={cardStyle}>
                            <div style={avatarStyle}>
                                {dr.firstName[0]}{dr.lastName[0]}
                            </div>
                            <h3 style={{ margin: '10px 0 5px 0', color: '#2d6cdf' }}>
                                dr {dr.firstName} {dr.lastName}
                            </h3>
                            <p style={{ color: '#555', fontWeight: 'bold', margin: '5px 0' }}>
                                {dr.specialization}
                            </p>
                            <div style={badgeStyle}>Aktivan</div><br/>
                            <button onClick={() => navigate('/appointments/')} style={buttonStyle}>
                                📅 Zakaži pregled
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#888', gridColumn: '1/-1', textAlign: 'center', padding: '50px' }}>
                        Nije pronađen nijedan doktor koji odgovara pretrazi.
                    </p>
                )}
            </div>
        </div>
    );
};

// --- STILOVI ---

const searchInputStyle = {
    padding: '12px 20px',
    width: '350px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    outline: 'none',
    fontSize: '16px'
};
const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#2d6cdf',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
};
const cardStyle = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    textAlign: 'center',
    border: '1px solid #eee',
    transition: 'transform 0.2s',
    cursor: 'default'
};

const avatarStyle = {
    width: '70px',
    height: '70px',
    backgroundColor: '#e3f2fd',
    color: '#2d6cdf',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 15px auto'
};

const badgeStyle = {
    display: 'inline-block',
    padding: '5px 15px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '20px',
    fontSize: '12px',
    marginTop: '15px',
    fontWeight: 'bold'
};

export default DoctorsList;