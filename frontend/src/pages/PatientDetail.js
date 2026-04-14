import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import appointmentService from "../services/appointment.service";

const PatientDetail = () => {
    const { id } = useParams(); // Uzima ID iz URL-a
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [history, setHistory] = useState([]);
    const [treatment, setTreatment] = useState({
        anamnesis: '',
        diagnosis: '',
        therapy: '' });

    useEffect(() => {
        const fetchData = async () => {
            // 1. Učitaj trenutni termin
           try {
               const appRes = await api.get(`/appointments/${id}`);
               setAppointment(appRes.data);

               if (appRes.data.patient?.id) {
                   const historyRes = await api.get(`/appointments/patient/${appRes.data.patient.id}/history`);
                   setHistory(historyRes.data);
               }
           } catch (err) {
               console.error("Greška pri učitavanju podataka: ", err);
           }
        };
        fetchData();
    }, [id]);

    const handleFinish = async (e) => {
        e.preventDefault();
        try {
            // Koristimo direktno 'id' iz URL-a umesto 'selectedApp.id'
            await appointmentService.finishAppointment(id, treatment);
            navigate('/doctor-dashboard');
        } catch (err) {
            alert("Greška pri čuvanju pregleda.");
        }
    };

    if (!appointment) return <p>Učitavanje kartona...</p>;

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
            {/* LEVA STRANA: ISTORIJA */}
            <div style={{ flex: 1, borderRight: '2px solid #eee', paddingRight: '20px', overflowY: 'auto' }}>
                <button onClick={() => navigate(-1)}>← Nazad u čekaonicu</button>
                <h2>Istorija bolesti: {appointment.patient.firstName} {appointment.patient.lastName}</h2>
                {history && history.length > 0 ? history.map(old => (
                    <div key={old.id} style={{ background: '#f4f4f4', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                        <small>{old.createdAt ? new Date(old.createdAt).toLocaleDateString() : 'Datum nepoznat'}</small>
                        <p><strong>Anamneza:</strong> {old.anamnesis || 'Nema zapisa'}</p>
                        <p><strong>Dijagnoza:</strong> {old.diagnosis || 'Nema zapisa'}</p>
                        <p><strong>Terapija:</strong> {old.therapy || 'Nema zapisa'}</p>
                    </div>
                )) : <p>Nema prethodnih nalaza za ovog pacijenta.</p>}
            </div>

            {/* DESNA STRANA: NOVI NALAZ */}
            <div style={{ flex: 1, paddingLeft: '20px' }}>
                <h2>Novi pregled</h2>
                <form onSubmit={handleFinish}>
                    <label>Anamneza:</label>
                    <textarea
                        style={{ width: '100%', height: '120px', marginBottom: '15px' }}
                        value={treatment.anamnesis}
                        onChange={e => setTreatment({...treatment, anamnesis: e.target.value})}
                    />
                    <label>Dijagnoza:</label>
                    <textarea
                        style={{ width: '100%', height: '120px', marginBottom: '15px' }}
                        value={treatment.diagnosis}
                        onChange={e => setTreatment({...treatment, diagnosis: e.target.value})}
                    />
                    <label>Terapija:</label>
                    <textarea
                        style={{ width: '100%', height: '120px', marginBottom: '15px' }}
                        value={treatment.therapy}
                        onChange={e => setTreatment({...treatment, therapy: e.target.value})}
                    />
                    <button type="submit" style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1.1em' }}>
                        Sačuvaj i završi pregled
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientDetail;