import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const lastName = localStorage.getItem('lastName');
    const [stats, setStats] = useState({ total: 0, completed: 0 });

    const [docName, setDocName] = useState(localStorage.getItem('lastName') || "");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            // Gađamo novi endpoint za specifičnog doktora
            const response = await api.get('/appointments/my-today');
            setAppointments(response.data);

            if (response.data.length > 0 && !docName) {
                const nameFromApi = response.data[0].doctor.lastName;
                setDocName(nameFromApi);
                localStorage.setItem('lastName', nameFromApi); // Sačuvaj za sledeći put
            }
            setStats({
                total: response.data.length,
                nextTime: response.data[0]?.appointmentTime || "--:--"
            });

            setLoading(false);
        } catch (err) {
            console.error("Greška pri učitavanju čekaonice:", err);
            setLoading(false);
        }
    };
    if (loading) return <div style={{ padding: '40px' }}>Učitavanje čekaonice...</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#fdfdfd', minHeight: '90vh' }}>
            <h1 style={{ color: '#1a2b4b', marginBottom: '30px' }}>👨‍⚕️ Dobro došli, dr {docName}</h1>

            {/* BRZA STATISTIKA */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
                <div style={cardStyle}>
                    <p style={labelStyle}>Pacijenti koji čekaju</p>
                    <h2 style={valueStyle}>{stats.total}</h2>
                </div>
                <div style={cardStyle}>
                    <p style={labelStyle}>Sledeći slobodan termin</p>
                    <h2 style={{ ...valueStyle, fontSize: '24px' }}>
                        {stats.nextTime}
                    </h2>
                </div>
                {/* DODATA TREĆA KARTICA ZA UTISAK */}
                <div style={{...cardStyle, borderLeft: '5px solid #28a745'}}>
                    <p style={labelStyle}>Status sistema</p>
                    <h2 style={{ ...valueStyle, fontSize: '20px', color: '#28a745' }}>Aktivan</h2>
                </div>
            </div>

            {/* TABELA ČEKAONICE */}
            <div style={tableContainerStyle}>
                <h3 style={{ marginBottom: '20px', color: '#1a2b4b' }}>📋 Pacijenti koji čekaju</h3>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                        <th style={thStyle}>Vreme</th>
                        <th style={thStyle}>Pacijent</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Akcija</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.length > 0 ? (
                        appointments.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={tdStyle}>{app.appointmentTime}</td>
                                <td style={tdStyle}>
                                    <strong>{app.patient?.firstName} {app.patient?.lastName}</strong>
                                </td>
                                <td style={tdStyle}>
                                    <span style={statusBadge(app.status)}>{app.status}</span>
                                </td>
                                <td style={tdStyle}>
                                    <button
                                        onClick={() => navigate(`/patient-detail/${app.id}`)}
                                        style={actionButtonStyle}
                                    >
                                        Otvori karton
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        /* FIX: tr MORA imati td unutra koji se proteže kroz celu tabelu (colSpan) */
                        <tr>
                            <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#999' }}>
                                Čekaonica je trenutno prazna.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- STILOVI (Izdvojeni radi preglednosti) ---
const cardStyle = {
    flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #eee'
};
const labelStyle = { color: '#888', fontSize: '14px', textTransform: 'uppercase' };
const valueStyle = { color: '#2d6cdf', fontSize: '32px', margin: '10px 0 0 0' };
const tableContainerStyle = {
    backgroundColor: '#fff', padding: '25px', borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
};
const thStyle = { padding: '15px', textAlign: 'left', color: '#666', fontWeight: '600' };
const tdStyle = { padding: '15px', color: '#444' };
const actionButtonStyle = {
    backgroundColor: '#2d6cdf', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500'
};

const statusBadge = (status) => ({
    padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
    backgroundColor: status === 'ZAKAZANO' ? '#e3f2fd' : '#f5f5f5',
    color: status === 'ZAKAZANO' ? '#1976d2' : '#666'
});

export default DoctorDashboard;