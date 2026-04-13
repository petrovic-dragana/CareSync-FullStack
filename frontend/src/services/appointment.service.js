import api from './api';

const getDoctorAppointments = () => {
    // Ovo će na backendu filtrirati termine za ulogovanog lekara
    return api.get('/appointments/today');
};

const finishAppointment = (id, data) => {
    // data sadrži { diagnosis: '...', therapy: '...' }
    return api.put(`/appointments/${id}/diagnose`, data);
};

export default { getDoctorAppointments, finishAppointment };