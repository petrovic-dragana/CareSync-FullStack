import React, { useState, useEffect } from 'react';
import appointmentService from '../services/appointment.service';
import {useNavigate} from "react-router-dom";

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        const response = await appointmentService.getDoctorAppointments();
        setAppointments(response.data);
    };



    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard za Lekara</h1>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* LEVA STRANA: Lista pacijenata koji čekaju */}
                <div style={{ flex: 1 }}>
                    <h3>Pacijenti u čekaonici</h3>
                    <table border="1" width="100%">
                        <thead>
                        <tr>
                            <th>Pacijent</th>
                            <th>Status</th>
                            <th>Akcija</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map(app => (
                            <tr key={app.id}>
                                <td>{app.patient.firstName} {app.patient.lastName}</td>
                                <td>{app.status}</td>
                                <td>
                                    <button onClick={() => navigate(`/patient-detail/${app.id}`)}>
                                        Otvori karton
                                    </button>                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;