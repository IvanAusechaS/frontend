import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const loginUser = async (loginField, password) => {
    const response = await axios.post(`${API_URL}login/`, { login_field: loginField, password });
    return response.data;
  };
  
  export const logoutUser = async (token) => {
    const response = await axios.post(`${API_URL}logout/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  };
  
  export const registerUser = async (cedula, email, nombre, telefono, password) => {
    const response = await axios.post(`${API_URL}registrarse/`, { cedula, email, nombre, telefono, password });
    return response.data;
  };
  
  export const getPuntosAtencion = async () => {
    const response = await axios.get(`${API_URL}puntos-atencion/`);
    return response.data;
  };
  
  export const getTurnos = async (token) => {
    const response = await axios.get(`${API_URL}turnos/`, {
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

export const createTicket = async (ticketData) => {
    const response = await axios.post(`${API_URL}tickets/`, ticketData);
    return response.data;
};

export const createTurno = async (turnoData) => {
    const response = await axios.post(`${API_URL}turnos/`, turnoData);
    return response.data;
};
export const buscarUsuarioPorCedula = async (cedula) => {
    const response = await axios.get(`${API_URL}buscar-usuario/${cedula}/`);
    return response.data;
};

