import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const loginUser = async (cedula, password) => {
  const response = await axios.post(`${API_URL}login/`, { cedula, password });
  return response.data;
};

export const logoutUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}logout/`, {}, config); // Ajusta la URL según tu backend
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}register/`, userData);
  return response.data;
};

export const getPuntosAtencion = async () => {
  const response = await axios.get(`${API_URL}puntos-atencion/`);
  return response.data;
};

export const createTurno = async (turnoData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}turnos/`, turnoData, config);
  return response.data;
};

export const getTurnos = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}turnos/`, config);
  return response.data;
};

export const updateTurno = async (turnoId, estado, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}turnos/${turnoId}/`, { estado }, config);
  return response.data;
};

export const createTicket = async (ticketData, token) => {
  const response = await axios.post(`${API_URL}tickets/`, ticketData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getUsuarios = async () => {
    const response = await axios.get(`${API_URL}usuarios/`);
    return response.data;
};

export const createUsuario = async (usuarioData) => {
    const response = await axios.post(`${API_URL}usuarios/`, usuarioData);
    return response.data;
};

export const createPuntoAtencion = async (puntoData) => {
    const response = await axios.post(`${API_URL}puntos-atencion/`, puntoData);
    return response.data;
};

export const getTickets = async () => {
    const response = await axios.get(`${API_URL}tickets/`);
    return response.data;
};

export const buscarUsuarioPorCedula = async (cedula) => {
    const response = await axios.get(`${API_URL}buscar-usuario/${cedula}/`);
    return response.data;
};

