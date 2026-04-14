import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Billing = () => {
    const [waitingForPayment, setWaitingForPayment] = useState([]);
    const [availableServices, setAvailableServices] = useState({});
    const [selectedPrices, setSelectedPrices] = useState({});

    useEffect(() => {
        fetchUnpaidAppointments();
    }, []);

    const fetchUnpaidAppointments = async () => {
        try {
            const res = await api.get('/appointments'); // Uzimamo sve
            const unpaid = res.data.filter(app => app.status === 'ZAVRSENO');
            setWaitingForPayment(unpaid);
            unpaid.forEach(app => fetchServicesForAppointment(app.id))
        } catch (err) {
            console.error("Greška pri učitavanju termina za naplatu:", err);
        }
    };
    const fetchServicesForAppointment = async (appId) => {
        try {
            const res = await api.get(`/appointments/${appId}/available-services`);
            setAvailableServices(prev => ({ ...prev, [appId]: res.data }));
        } catch (err) {
            console.error("Greška pri učitavanju usluga za termin " + appId, err);
        }
    };

    const handlePayment = async (appId, servicePrice) => {
        if (!servicePrice) {
            alert("Molimo izaberite uslugu.");
            return;
        }

        try {
            await api.put(`/appointments/${appId}/pay`, parseFloat(servicePrice), {
                headers: { 'Content-Type': 'application/json' }
            });

            alert("Uplata uspešno evidentirana!");
            const newPrices = { ...selectedPrices };
            delete newPrices[appId];
            setSelectedPrices(newPrices);

            fetchUnpaidAppointments();
        } catch (err) {
            alert("Greška pri naplati.");
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#fdfdfd', minHeight: '100vh' }}>
            <h2 style={{ color: '#1a2b4b' }}>💳 Naplata usluga</h2>
            <div style={containerStyle}>
                {waitingForPayment.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                        <tr style={headerRowStyle}>
                            <th style={thStyle}>Pacijent</th>
                            <th style={thStyle}>Doktor (Spec.)</th>
                            <th style={thStyle}>Izbor Usluge</th>
                            <th style={thStyle}>Cena</th>
                            <th style={thStyle}>Akcija</th>
                        </tr>
                        </thead>
                        <tbody>
                        {waitingForPayment.map(app => (
                            <tr key={app.id} style={rowStyle}>
                                <td style={tdStyle}><strong>{app.patient?.firstName} {app.patient?.lastName}</strong></td>
                                <td style={tdStyle}>dr {app.doctor?.lastName} ({app.doctor?.specialization})</td>
                                <td style={tdStyle}>
                                    <select
                                        style={inputStyle}
                                        value={selectedPrices[app.id] || ""}
                                        onChange={(e) => setSelectedPrices({
                                            ...selectedPrices,
                                            [app.id]: e.target.value
                                        })}
                                    >
                                        <option value="">-- Izaberi uslugu --</option>
                                        {(availableServices[app.id] || []).map(s => (
                                            <option key={s.id} value={s.price}>{s.name}</option>
                                        ))}
                                    </select>
                                </td>
                                <td style={tdStyle}>
                                        <span style={{ fontWeight: 'bold', color: '#28a745' }}>
                                            {selectedPrices[app.id] ? `${selectedPrices[app.id]} RSD` : '-'}
                                        </span>
                                </td>
                                <td style={tdStyle}>
                                    <button onClick={() => handlePayment(app.id, selectedPrices[app.id])} style={payButtonStyle}>
                                        Potvrdi naplatu
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={emptyBoxStyle}>Nema pregleda za naplatu. ✨</div>
                )}
            </div>
        </div>
    );
};

// --- STILOVI ---
const containerStyle = { backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const headerRowStyle = { backgroundColor: '#f8faff', borderBottom: '2px solid #eee' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#2d6cdf', fontWeight: 'bold' };
const tdStyle = { padding: '15px', borderBottom: '1px solid #eee' };
const rowStyle = { transition: '0.3s' };
const inputStyle = { padding: '8px', borderRadius: '5px', border: '1px solid #ddd', width: '120px' };
const payButtonStyle = { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const emptyBoxStyle = { padding: '50px', textAlign: 'center', color: '#888', fontSize: '18px' };

export default Billing;