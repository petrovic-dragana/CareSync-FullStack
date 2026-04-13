import api from './api';

const getAllPatients = () => {
    return api.get('/nurse/patients');
};

const createPatient = (patientData) => {
    return api.post('/nurse/patients', patientData);
};

export default { getAllPatients, createPatient };