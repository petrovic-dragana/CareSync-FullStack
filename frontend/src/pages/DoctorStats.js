import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DoctorStats = () => {
    const [stats, setStats] = useState({
        totalPatientsServed: 0,
        todayAppointments: 0,
        completedToday: 0,
        averageConsultationTime: "15 min" // Primer statike ako backend ne šalje
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctorStats = async () => {
            try {
                const res = await api.get('/stats/doctor-stats');
                setStats(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Greška pri učitavanju statistike:", err);
                setLoading(false);
            }
        };
        fetchDoctorStats();
    }, []);

    const progressPercentage = stats.todayAppointments > 0
        ? (stats.completedToday / stats.todayAppointments) * 100
        : 0;

    if (loading) return <div style={{ padding: '40px' }}>Analiziram podatke...</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <h2 style={{ color: '#1a2b4b', marginBottom: '10px' }}>📈 Moja statistika</h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>Pregled vašeg rada i učinka.</p>

            {/* GLAVNE KARTICE */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={statCard}>
                    <span style={iconStyle}>👥</span>
                    <p style={labelStyle}>Ukupno pacijenata</p>
                    <h2 style={valueStyle}>{stats.totalPatientsServed}</h2>
                </div>
                <div style={statCard}>
                    <span style={iconStyle}>📅</span>
                    <p style={labelStyle}>Današnji termini</p>
                    <h2 style={valueStyle}>{stats.todayAppointments}</h2>
                </div>
                <div style={statCard}>
                    <span style={iconStyle}>⏱️</span>
                    <p style={labelStyle}>Prosek po pregledu</p>
                    <h2 style={valueStyle}>{stats.averageConsultationTime}</h2>
                </div>
            </div>

            {/* DNEVNI PROGRES */}
            <div style={progressContainer}>
                <h3 style={{ marginBottom: '20px', color: '#1a2b4b' }}>Učinak za danas</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#666' }}>Pregledano: {stats.completedToday} od {stats.todayAppointments}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d6cdf' }}>{Math.round(progressPercentage)}%</span>
                </div>
                <div style={progressBarEmpty}>
                    <div style={{ ...progressBarFull, width: `${progressPercentage}%` }}></div>
                </div>
                <p style={{ marginTop: '15px', fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                    * Podaci se ažuriraju u realnom vremenu nakon svakog završenog pregleda.
                </p>
            </div>
        </div>
    );
};

// --- STILOVI ---
const statCard = {
    flex: 1,
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #eee',
    textAlign: 'center'
};

const iconStyle = { fontSize: '30px', display: 'block', marginBottom: '10px' };
const labelStyle = { color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' };
const valueStyle = { color: '#2d6cdf', fontSize: '32px', margin: 0 };

const progressContainer = {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid #eee'
};

const progressBarEmpty = { width: '100%', height: '12px', backgroundColor: '#f0f2f5', borderRadius: '10px', overflow: 'hidden' };
const progressBarFull = { height: '100%', backgroundColor: '#2d6cdf', borderRadius: '10px', transition: 'width 0.5s ease-in-out' };

export default DoctorStats;