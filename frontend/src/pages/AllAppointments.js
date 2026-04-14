import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AllAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Proveri da li ti je na backendu ruta tačno /api/appointments
                const res = await api.get('/appointments');
                setAppointments(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Greška pri učitavanju termina:", err);
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayList = appointments.filter(app => app.appointmentDate === todayStr);
    const allOtherList = appointments.filter(app => app.appointmentDate !== todayStr);

    const renderTable = (list) => (
        <div style={{ overflowX: 'auto', marginBottom: '30px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                    <th style={tdStyle}>Pacijent</th>
                    <th style={tdStyle}>Datum</th>
                    <th style={tdStyle}>Vreme</th>
                    <th style={tdStyle}>Doktor</th>
                    <th style={tdStyle}>Status</th>
                </tr>
                </thead>
                <tbody>
                {list.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={tdStyle}>{app.patient?.firstName} {app.patient?.lastName}</td>
                        <td style={tdStyle}>{app.appointmentDate}</td>
                        <td style={tdStyle}>{app.appointmentTime}</td>
                        <td style={tdStyle}>dr {app.doctor?.firstName} {app.doctor?.lastName} - {app.doctor?.specialization}</td>
                        <td style={tdStyle}>
                                <span style={{
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    backgroundColor: app.status === 'ZAKAZANO' ? '#e3f2fd' : '#f5f5f5',
                                    color: app.status === 'ZAKAZANO' ? '#1976d2' : '#666'

                                }}>
                                    {app.status}
                                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );

    if (loading) return <div style={{ padding: '40px' }}>Učitavanje podataka...</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <h2 style={{ color: '#1a2b4b' }}>📅 Pregled svih termina</h2>
            <hr style={{ marginBottom: '30px', opacity: '0.2' }} />

            <h3 style={{ color: '#2d6cdf', marginBottom: '15px' }}>Danas</h3>
            {todayList.length > 0 ? renderTable(todayList) : <p style={emptyMsg}>Nema zakazanih termina za danas.</p>}

            <h3 style={{ color: '#2d6cdf', marginBottom: '15px', marginTop: '40px' }}>Svi ostali termini</h3>
            {allOtherList.length > 0 ? renderTable(allOtherList) : <p style={emptyMsg}>Nema drugih termina u bazi.</p>}
        </div>
    );
};

const tdStyle = { padding: '15px', textAlign: 'left' };
const emptyMsg = { padding: '20px', backgroundColor: '#fff', borderRadius: '8px', color: '#888', border: '1px dashed #ccc' };

export default AllAppointments;