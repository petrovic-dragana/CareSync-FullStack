import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from "react-router-dom";

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointmentsCount: 0,
    activeDoctors: 0,
    todayList: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/stats/nurse-dashboard`);        setStats(res.data);
      } catch (err) {
        console.error("Neuspelo povlačenje statistike", err);
      }
    };
    fetchStats();
  }, []);

  const cardStyle = {
    flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #eee'
  };

  const buttonStyle = {
    padding: '12px 24px', borderRadius: '8px', border: 'none',
    fontWeight: 'bold', cursor: 'pointer', marginRight: '15px'
  };

  const thStyle = { padding: '12px', textAlign: 'left', borderBottom: '2px solid #eee', color: '#666' };

  return (
      <div style={{ padding: '40px', backgroundColor: '#fdfdfd', minHeight: '90vh' }}>
        <h1 style={{ color: '#1a2b4b', marginBottom: '30px' }}>Kontrolna tabla</h1>

        {/* STATISTIČKE KARTICE */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
          <div style={cardStyle}>
            <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>Pacijenti</p>
            <h2 style={{ color: '#2d6cdf' }}>{stats.totalPatients}</h2>
          </div>
          <div style={cardStyle}>
            <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>Današnji termini</p>
            <h2 style={{ color: '#2d6cdf' }}>{stats.todayAppointmentsCount}</h2>
          </div>
          <div style={cardStyle}>
            <p style={{ color: '#888', fontSize: '12px', textTransform: 'uppercase' }}>Lekari</p>
            <h2 style={{ color: '#2d6cdf' }}>{stats.activeDoctors}</h2>
          </div>
        </div>

        {/* AKCIJE */}
        <div style={{ display: 'flex', marginBottom: '30px' }}>
          <button onClick={() => navigate('/appointments')} style={{ ...buttonStyle, backgroundColor: '#2d6cdf', color: '#fff' }}>
            + Nova rezervacija
          </button>
        </div>

        {/* TABELA SA DANASNJIM TERMINIMA - POPRAVLJENA STRUKTURA */}
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px' }}>📅 Današnji raspored</h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
            <tr>
              <th style={thStyle}>Pacijent</th>
              <th style={thStyle}>Vreme</th>
              <th style={thStyle}>Doktor</th>
              <th style={thStyle}>Status</th>
            </tr>
            </thead>
            {/*<tbody>*/}
            {/*{stats.todayList.length > 0 ? (*/}
            {/*    stats.todayList.map(app => (*/}
            {/*        <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>*/}
            {/*          <td style={{ padding: '12px' }}>*/}
            {/*            {app.patient ? `${app.patient.firstName} ${app.patient.lastName}` : 'Nepoznat pacijent'}*/}
            {/*          </td>*/}
            {/*          <td style={{ padding: '12px' }}>{app.appointmentTime || 'N/A'}</td>*/}
            {/*          <td style={{ padding: '12px' }}>*/}
            {/*            dr {app.doctor ? `${app.doctor.lastName}` : 'N/A'} ({app.doctor?.specialization})*/}
            {/*          </td>*/}
            {/*          <td style={{ padding: '12px' }}>*/}
            {/*        <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e1f5fe', color: '#01579b', fontSize: '11px', fontWeight: 'bold' }}>*/}
            {/*          {app.status}*/}
            {/*        </span>*/}
            {/*          </td>*/}
            {/*        </tr>*/}
            {/*    ))*/}
            {/*) : (*/}
            {/*    <tr>*/}
            {/*      <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>Nema termina za danas.</td>*/}
            {/*    </tr>*/}
            {/*)}*/}
            {/*</tbody>*/}
            <tbody>
            {stats.todayList && stats.todayList.length > 0 ? (
                stats.todayList.map(app => (
                    <tr key={app.id}>
                      <td>{app.patient?.firstName} {app.patient?.lastName}</td>
                      <td>{app.appointmentTime}</td>
                      <td>dr {app.doctor?.lastName} - {app.doctor?.specialization}</td>
                      <td>{app.status}</td>
                    </tr>
                ))
            ) : (
                <tr><td colSpan="4">Nema termina za danas u bazi.</td></tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default NurseDashboard;