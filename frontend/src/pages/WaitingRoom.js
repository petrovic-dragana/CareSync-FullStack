import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from "react-router-dom";

const WaitingRoom = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWaitingRoom();
    }, []);

    const fetchWaitingRoom = async () => {
        try {
            // Menjamo sa '/appointments/today' na tvoj novi filtrirani endpoint
            const response = await api.get('/appointments/my-today');
            setAppointments(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Greška pri učitavanju čekaonice:", err);
            setLoading(false);
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>Učitavanje čekaonice...</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ color: '#1a2b4b', margin: 0 }}>📋 Čekaonica</h1>
                    <p style={{ color: '#666' }}>Lista pacijenata zakazanih za danas.</p>
                </div>
                <button
                    onClick={fetchWaitingRoom}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #2d6cdf', color: '#2d6cdf', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    🔄 Osveži listu
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8faff', borderBottom: '2px solid #eee' }}>
                        <th style={thStyle}>Vreme</th>
                        <th style={thStyle}>Pacijent</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Akcija</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.length > 0 ? (
                        appointments.map(app => (
                            <tr key={app.id} style={rowStyle}>
                                <td style={tdStyle}>
                                    <span style={{ fontWeight: 'bold', color: '#2d6cdf' }}>{app.appointmentTime}</span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                                {app.patient?.firstName} {app.patient?.lastName}
                                            </span>
                                        <span style={{ fontSize: '12px', color: '#888' }}>ID: #{app.id}</span>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <span style={statusBadge(app.status)}>{app.status}</span>
                                </td>
                                <td style={tdStyle}>
                                    {app.status === 'ZAKAZANO' ? (
                                        <button
                                            onClick={() => navigate(`/patient-detail/${app.id}`)}
                                            style={examineButtonStyle}
                                        >
                                            Započni pregled
                                        </button>
                                    ) : (
                                        <span style={{ color: '#999', fontSize: '13px italic' }}>Pregled obavljen</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ padding: '50px', textAlign: 'center', color: '#888' }}>
                                Trenutno nema pacijenata u čekaonici.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STILOVI ---
const thStyle = { padding: '20px', textAlign: 'left', color: '#1a2b4b', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' };
const tdStyle = { padding: '20px', borderBottom: '1px solid #f0f0f0' };
const rowStyle = { transition: 'background 0.2s' };

const examineButtonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    boxShadow: '0 2px 6px rgba(40, 167, 69, 0.2)'
};

const statusBadge = (status) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    backgroundColor: status === 'ZAKAZANO' ? '#e3f2fd' : '#e8f5e9',
    color: status === 'ZAKAZANO' ? '#1976d2' : '#2e7d32'
});

export default WaitingRoom;