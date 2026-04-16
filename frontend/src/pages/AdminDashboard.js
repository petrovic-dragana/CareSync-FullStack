import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalNurses: 0,
        totalAppointments: 0
    });

    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '', firstName: '', lastName: '', role: 'ROLE_DOCTOR', specialization: ''
    });

    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('7'); // Default 7 dana

    const [showLogModal, setShowLogModal] = useState(false);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Greška pri učitavanju admin podataka:", err);
            setLoading(false);
        }
    };

    // Poziva se na klik glavnog dugmeta
    const openReportModal = () => {
        setReportData(null); // Resetujemo stare podatke
        setShowReportModal(true);
    };

    // Poziva se unutar modala kada korisnik izabere period i klikne "Prikaži"
    const handleGenerateReport = async () => {
        try {
            const res = await api.get(`/admin/report?days=${selectedPeriod}`);
            console.log("Stiglo sa backenda:", res.data); // Pogledaj u F12 konzolu
            if (res.data) {
                setReportData(res.data);
            }
        } catch (err) {
            console.error("Greška:", err.response); // Vidi šta kaže server
            alert("Greška: " + (err.response?.data?.message || "Server nedostupan"));
        }
    };

    const fetchLogs = async () => {
        try {
            const res = await api.get('/admin/logs');
            setLogs(res.data);
            setShowLogModal(true);
        } catch (err) {
            alert("Greška pri učitavanju logova.");
        }
    };

    const handleCreateUser = async () => {
        try {
            await api.post('/admin/create-user', newUser);
            alert("Korisnik uspešno kreiran!");
            setShowModal(false);
            fetchAdminData(); // Osveži statistiku bez reloada celog prozora
        } catch (err) {
            alert("Greška pri kreiranju korisnika.");
        }
    };

    if (loading) return <div style={{ padding: '40px' }}>Učitavanje kontrolne table...</div>;

    return (
        <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <h1 style={{ color: '#1a2b4b', marginBottom: '10px' }}>🛡️ Admin Panel</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Upravljanje sistemom i korisnicima.</p>

            {/* STATISTIKA */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                <div style={adminCard}><h3>Ukupno korisnika</h3><p style={numberStyle}>{stats.totalUsers}</p></div>
                <div style={adminCard}><h3>Broj lekara</h3><p style={{...numberStyle, color: '#2d6cdf'}}>{stats.totalDoctors}</p></div>
                <div style={adminCard}><h3>Broj sestara</h3><p style={{...numberStyle, color: '#28a745'}}>{stats.totalNurses}</p></div>
                <div style={adminCard}><h3>Svi termini</h3><p style={{...numberStyle, color: '#f39c12'}}>{stats.totalAppointments}</p></div>
            </div>

            {/* AKCIJE */}
            <div style={{ marginTop: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px' }}>
                <h3>Brze akcije</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                    <button onClick={() => setShowModal(true)} style={actionBtn}>➕ Dodaj novog korisnika</button>
                    <button onClick={openReportModal} style={{...actionBtn, backgroundColor: '#2d6cdf'}}>📋 Izveštaj o radu</button>
                    <button onClick={fetchLogs} style={{...actionBtn, backgroundColor: '#dc3545'}}>⚠️ Sistemski logovi</button>
                </div>
            </div>

            {/* MODAL ZA IZVESTAJ O RADU */}
            {showReportModal && (
                <div style={modalOverlay}>
                    <div style={{...modalContent, width: '500px'}}>
                        <h2 style={{ borderBottom: '2px solid #2d6cdf', paddingBottom: '10px' }}>📊 Izveštaj o radu klinike</h2>

                        <div style={{ marginTop: '20px' }}>
                            <label>Izaberite period izveštaja:</label>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                    style={{...inputStyle, flex: 1}}
                                >
                                    <option value="7">Poslednjih 7 dana (Nedeljni)</option>
                                    <option value="30">Poslednjih 30 dana (Mesečni)</option>
                                    <option value="365">Godišnji izveštaj</option>
                                </select>
                                <button onClick={handleGenerateReport} style={{...actionBtn, padding: '10px'}}>Prikaži</button>
                            </div>
                        </div>

                        {reportData ? (
                            <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                <p><strong>Datum generisanja:</strong> {reportData.reportDate}</p>
                                <p><strong>Period:</strong> Zadnjih {reportData.periodDays} dana</p>
                                <hr />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Završenih pregleda:</span>
                                    <span style={{ fontWeight: 'bold' }}>{reportData.completedAppointments}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#28a745' }}>
                                    <span>Ukupna zarada:</span>
                                    <span style={{ fontWeight: 'bold' }}>
        {reportData.revenue !== undefined ? reportData.revenue : 0} RSD
    </span>
                                </div>
                                <button onClick={() => window.print()} style={{...actionBtn, width: '100%', marginTop: '15px', backgroundColor: '#555'}}>🖨️ Štampaj izveštaj</button>
                            </div>
                        ) : (
                            <p style={{ marginTop: '20px', color: '#888', textAlign: 'center' }}>Izaberite period i kliknite na dugme za prikaz podataka.</p>
                        )}

                        <div style={{ marginTop: '20px', textAlign: 'right' }}>
                            <button onClick={() => setShowReportModal(false)} style={{...actionBtn, backgroundColor: '#dc3545'}}>Zatvori</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ZA DODAVANJE KORISNIKA - (Ostaje isti) */}
            {showModal && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h2>Dodaj novog zaposlenog</h2>
                        <div style={inputGroup}>
                            <input type="text" placeholder="Ime" onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} style={inputStyle}/>
                            <input type="text" placeholder="Prezime" onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} style={inputStyle}/>
                            <input type="text" placeholder="Korisničko ime" onChange={(e) => setNewUser({...newUser, username: e.target.value})} style={inputStyle}/>
                            <select onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={inputStyle}>
                                <option value="ROLE_DOCTOR">Lekar</option>
                                <option value="ROLE_NURSE">Sestra</option>
                                <option value="ROLE_ADMIN">Administrator</option>
                            </select>
                            {newUser.role === 'ROLE_DOCTOR' && (
                                <input type="text" placeholder="Specijalizacija" onChange={(e) => setNewUser({...newUser, specialization: e.target.value})} style={inputStyle}/>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={handleCreateUser} style={{...actionBtn, flex: 1}}>Sačuvaj</button>
                            <button onClick={() => setShowModal(false)} style={{...actionBtn, backgroundColor: '#666', flex: 1}}>Odustani</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL ZA LOGOVE - (Ostaje isti) */}
            {showLogModal && (
                <div style={modalOverlay}>
                    <div style={{...modalContent, width: '600px'}}>
                        <h2>⚠️ Sistemski logovi</h2>
                        <div style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '15px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                <tr style={{ backgroundColor: '#f8f9fa' }}>
                                    <th style={tableHeader}>Vreme</th>
                                    <th style={tableHeader}>Akcija</th>
                                    <th style={tableHeader}>Korisnik</th>
                                </tr>
                                </thead>
                                <tbody>
                                {logs.map((log, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={tableCell}>{log.time}</td>
                                        <td style={tableCell}>{log.action}</td>
                                        <td style={tableCell}>@{log.user}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <button onClick={() => setShowLogModal(false)} style={{...actionBtn, marginTop: '20px', width: '100%'}}>Zatvori</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// STILOVI (Isti kao tvoji)
const adminCard = { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' };
const numberStyle = { fontSize: '36px', fontWeight: 'bold', margin: '10px 0' };
const actionBtn = { padding: '12px 20px', backgroundColor: '#1a2b4b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContent = { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' };
const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #ccc' };
const tableHeader = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #eee', color: '#1a2b4b' };
const tableCell = { padding: '12px', color: '#444', fontSize: '14px' };

export default AdminDashboard;