import React, { useState, useEffect } from 'react';
import patientService from '../services/patient.service';

const NurseDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', jmbg: '', phone: '' });

  // 1. Učitaj pacijente iz MySQL baze
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    const response = await patientService.getAllPatients();
    setPatients(response.data);
  };

  // 2. Funkcija za dodavanje novog pacijenta
  const handleSubmit = async (e) => {
    e.preventDefault();
    await patientService.createPatient(newPatient);
    setNewPatient({ firstName: '', lastName: '', jmbg: '', phone: '' }); // Reset forme
    loadPatients(); // Osveži tabelu
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard za Medicinsku Sestru</h1>

      <h3>Registracija novog pacijenta</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <input placeholder="Ime" value={newPatient.firstName} onChange={e => setNewPatient({...newPatient, firstName: e.target.value})} />
        <input placeholder="Prezime" value={newPatient.lastName} onChange={e => setNewPatient({...newPatient, lastName: e.target.value})} />
        <input placeholder="JMBG" value={newPatient.jmbg} onChange={e => setNewPatient({...newPatient, jmbg: e.target.value})} />
        <input placeholder="Telefon" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
        <button type="submit">Sačuvaj u bazu</button>
      </form>

      <h3>Lista pacijenata u sistemu</h3>
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Ime i Prezime</th>
            <th>JMBG</th>
            <th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.firstName} {p.lastName}</td>
              <td>{p.jmbg}</td>
              <td>{p.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NurseDashboard;