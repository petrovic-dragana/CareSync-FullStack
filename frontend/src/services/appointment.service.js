import api from './api';

const getDoctorAppointments = () => {
    return api.get('/appointments/today');
};

const finishAppointment = (id, treatmentData) => {
    return api.put(`/appointments/${id}/diagnose`, treatmentData);
};

export default { getDoctorAppointments, finishAppointment };