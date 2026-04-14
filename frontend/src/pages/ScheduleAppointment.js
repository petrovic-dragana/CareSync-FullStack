import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const ScheduleAppointment = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [isNewPatient, setIsNewPatient] = useState(false);
    const [workingDaysInfo, setWorkingDaysInfo] = useState("");
    const [dateError, setDateError] = useState("");
    const [bookedSlots, setBookedSlots] = useState([]);

    const [formData, setFormData] = useState({
        doctorId: '',
        date: '',
        time: '',
        patientId: '',
        newPatient: { firstName: '', lastName: '', phone: '' }
    });

    const timeSlots = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const drRes = await api.get('/users/doctors');
                const ptRes = await api.get('/nurse/patients');
                setDoctors(drRes.data);
                setPatients(ptRes.data);
            } catch (err) { console.error("Greška:", err); }
        };
        loadInitialData();
    }, []);

    // Ključni deo: Vuče zauzete termine čim se promeni doktor ili datum
    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (formData.doctorId && formData.date) {
                try {
                    const res = await api.get(`/appointments/booked-slots?doctorId=${formData.doctorId}&date=${formData.date}`);
                    setBookedSlots(res.data);
                } catch (err) { console.error("Greška pri proveri termina:", err); }
            }
        };
        fetchBookedSlots();
    }, [formData.doctorId, formData.date]);

    const handleDoctorChange = (e) => {
        const id = e.target.value;
        const dr = doctors.find(d => d.id === parseInt(id));
        setFormData({ ...formData, doctorId: id, time: '' });
        if (dr) {
            setWorkingDaysInfo(dr.specialization === 'Hirurg' ? "Sreda, Petak" :
                dr.specialization === 'Kardiolog' ? "Ponedeljak, Utorak" : "Svaki dan");
        }
    };

    const handleSchedule = async () => {
        if(!formData.doctorId || !formData.date || !formData.time || (!isNewPatient && !formData.patientId)) return alert("Popuni sve!");
        const selectedDr = doctors.find(dr => dr.id === parseInt(formData.doctorId));
        let patientName = "";

        if (isNewPatient) {
            patientName = `${formData.newPatient.firstName} ${formData.newPatient.lastName}  - ${formData.newPatient.phone}`;
        } else {
            const selectedPt = patients.find(pt => pt.id === parseInt(formData.patientId));
            patientName = selectedPt ? `${selectedPt.firstName} ${selectedPt.lastName} - ${selectedPt.phone}` : "Pacijent";
        }
        const payload = {
            doctorId: parseInt(formData.doctorId),
            date: formData.date,
            time: formData.time,
            patientId: isNewPatient ? null : parseInt(formData.patientId),
            newPatient: isNewPatient ? formData.newPatient : null
        };
        try {
            await api.post('/appointments/schedule', payload);
            alert(
                `✅ TERMIN USPEŠNO DODAT!\n\n` +
                `👨‍⚕️ Doktor: dr ${selectedDr?.firstName} ${selectedDr?.lastName} - ${selectedDr?.specialization}\n` +
                `👤 Pacijent: ${patientName} \n` +
                `📅 Datum: ${formData.date}\n` +
                `⏰ Vreme: ${formData.time}h`
            );
            navigate('/nurse-dashboard');
        } catch (err) {
            console.error("Server Error:", err.response?.data);
            alert("Došlo je do greške prilikom zakazivanja. Proverite da li je termin u međuvremenu zauzet."); }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2d6cdf', textAlign: 'center' }}>📅 Novi termin</h2>

            <label>Izaberi lekara: <small style={{color:'red'}}>{workingDaysInfo}</small></label>
            <select style={inputStyle} onChange={handleDoctorChange} value={formData.doctorId}>
                <option value="">-- Odaberi lekara --</option>
                {doctors.map(dr => <option key={dr.id} value={dr.id}>dr {dr.firstName} {dr.lastName} - {dr.specialization}</option>)}
            </select>

            <label>Izaberi datum:</label>
            <input type="date" style={inputStyle} onChange={e => setFormData({...formData, date: e.target.value, time: ''})} />

            <label style={{ fontWeight: 'bold' }}>Dostupni termini:</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '15px 0' }}>
                {timeSlots
                    .filter(t => !bookedSlots.some(booked => booked.startsWith(t))) // OVO SKLANJA ZAUZETE
                    .map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setFormData({...formData, time: t})}
                            style={{
                                padding: '10px',
                                border: '1px solid #2d6cdf',
                                borderRadius: '8px',
                                backgroundColor: formData.time === t ? '#2d6cdf' : '#fff',
                                color: formData.time === t ? '#fff' : '#2d6cdf',
                                cursor: 'pointer'
                            }}
                        >{t}</button>
                    ))
                }
            </div>

            {/* Ostatak za pacijente ostaje isti... */}
            <div style={{marginTop: '20px'}}>
                <label><input type="radio" checked={!isNewPatient} onChange={() => setIsNewPatient(false)} /> Postojeći</label>
                <label style={{marginLeft: '15px'}}><input type="radio" checked={isNewPatient} onChange={() => setIsNewPatient(true)} /> Novi</label>

                {!isNewPatient ? (
                    <select style={inputStyle} onChange={e => setFormData({...formData, patientId: e.target.value})}>
                        <option value="">-- Izaberi pacijenta --</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}{p.phone}</option>)}
                    </select>
                ) : (
                    <div style={{padding:'10px', border:'1px dashed #2d6cdf', borderRadius:'8px'}}>
                        <input placeholder="Ime" style={inputStyle} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, firstName: e.target.value}})} />
                        <input placeholder="Prezime" style={inputStyle} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, lastName: e.target.value}})} />
                        <input placeholder="Broj telefona" style={inputStyle} onChange={e => setFormData({...formData, newPatient: {...formData.newPatient, phone: e.target.value}})} />
                    </div>
                )}
            </div>

            <button onClick={handleSchedule} style={mainBtnStyle}>Zakaži termin</button>
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd' };
const mainBtnStyle = { width: '100%', padding: '15px', backgroundColor: '#2d6cdf', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', marginTop: '20px' };

export default ScheduleAppointment;