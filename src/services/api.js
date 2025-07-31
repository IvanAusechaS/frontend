import axios from 'axios';


const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/tickets/';

// Configura una instancia de axios con headers por defecto
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },  
});

// Función para renovar el token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  try {
    const response = await axios.post(`${API_URL}token/refresh/`, { refresh: refreshToken });
    const { access } = response.data;
    localStorage.setItem('token', access);
    return access;
  } catch (error) {
    console.error('Error renovando token:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Interceptor para añadir el token y manejar 401
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Token enviado en interceptor:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No hay token en localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Funciones que usan el interceptor
// Actualizar servicios de un punto de atención
export const updateServiciosPuntoAtencion = async (puntoId, serviciosTexto) => {
  try {
    const response = await api.patch(`puntos-atencion/${puntoId}/servicios/`, {
      servicios_texto: serviciosTexto
    });
    return response.data;
  } catch (error) {
    console.error('Error en updateServiciosPuntoAtencion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPuntosAtencion = async () => {
  try {
    const response = await api.get('puntos-atencion/');
    console.log('Respuesta de puntos-atencion:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getPuntosAtencion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const cancelTurno = async (turnoId) => {
  try {
    const response = await api.patch(`turnos/${turnoId}/`, { estado: 'Cancelado' });
    console.log('Turno cancelado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en cancelTurno:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const getCurrentTurnos = async (puntoAtencionId, date = new Date().toISOString().split('T')[0]) => {
  try {
    const response = await api.get('turnos/colas/', {
      params: { punto_atencion_id: puntoAtencionId, fecha: date }
    });
    console.log('Colas de turnos para fecha', date, ':', response.data);
    return response.data; // Devuelve { turnos: [...] }
  } catch (error) {
    console.error('Error en getCurrentTurnos:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const createTurno = async (turnoData, userId) => {
  try {
    console.log('Datos enviados a /turnos/create/:', turnoData);
    if (!userId) {
      throw new Error('No se proporcionó el ID del usuario');
    }
    const response = await api.post('turnos/create/', {
      punto_atencion_id: turnoData.punto_atencion,
      tipo_cita: turnoData.tipo_cita,
      respuestas_prioridad: turnoData.respuestas_prioridad || {}
    });
    console.log('Turno creado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error completo en createTurno:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserTurnos = async () => {
  try {
    const response = await api.get('turnos/list/');
    console.log('Turnos del usuario obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getUserTurnos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getTurnos = async () => {
  try {
    const response = await api.get('profesional-turnos/');
    console.log('Turnos obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getTurnos:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateTurno = async (turnoId, updatedData) => {
  try {
    const response = await api.put(`turnos/${turnoId}/`, updatedData);
    console.log('Turno actualizado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar turno:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('tickets/', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error en createTicket:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('login/', { email, password });
    console.log('Respuesta de login:', response.data);
    console.log('Datos del usuario tras login:', response.data.user);
    if (!response.data.user || !response.data.user.id) {
      console.error('ID del usuario no encontrado en la respuesta del login');
      throw new Error('ID del usuario no encontrado');
    }
    localStorage.setItem('userId', response.data.user.id);
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    const userData = response.data.user;
    localStorage.setItem('user', JSON.stringify(userData)); // Asegúrate de guardar solo user
    console.log('Usuario almacenado en localStorage:', JSON.parse(localStorage.getItem('user')));
    return response.data;
  } catch (error) {
    console.error('Error en loginUser:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('logout/', { refresh: refreshToken });
    console.log('Logout exitoso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en logoutUser:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const registerUser = async (userData) => {
  try {
    const response = await api.post('register/', userData);
    console.log('Usuario registrado:', response.data);
    return response.data;
  } catch (error) {
    const errorDetails = error.response ? error.response.data : { error: error.message, details: 'Error desconocido' };
    console.error('Error en registerUser:', JSON.stringify(errorDetails, null, 2));
    throw errorDetails; 
  }
};

export const getUsuarios = async () => {
  try {
    const response = await api.get('usuarios/');
    return response.data;
  } catch (error) {
    console.error('Error en getUsuarios:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('usuarios/', usuarioData);
    return response.data;
  } catch (error) {
    console.error('Error en createUsuario:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createPuntoAtencion = async (puntoData) => {
  try {
    const response = await api.post('puntos-atencion/', puntoData);
    return response.data;
  } catch (error) {
    console.error('Error en createPuntoAtencion:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPuntosAtencionServices = async () => {
  try {
    const response = await api.get('puntos-atencion-services/');
    console.log('Puntos y servicios:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getPuntosAtencionServices:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getTickets = async () => {
  try {
    const response = await api.get('tickets/');
    console.log('Tickets obtenidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getTickets:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const buscarUsuarioPorCedula = async (cedula) => {
  try {
    const response = await api.get(`buscar-usuario/${cedula}/`);
    return response.data;
  } catch (error) {
    console.error('Error en buscarUsuarioPorCedula:', error.response ? error.response.data : error.message);
    throw error;
  }
};
export const getProfesionalStats = async () => {
  try {
    const response = await api.get('profesional-stats/');
    return response.data;
  } catch (error) {
    console.error('Error en getProfesionalStats:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para cambiar el rol de un usuario
export const cambiarRolUsuario = async (userId, nuevoRol) => {
  try {
    const response = await api.patch(`usuarios/${userId}/cambiar-rol/`, { rol: nuevoRol });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar rol:', error.response?.data || error.message);
    throw error;
  }
};

// Función para obtener turnos pendientes por servicio
export const getPendingTurnosByService = async () => {
  try {
    const response = await api.get('pending-turnos-by-service/');
    console.log('Turnos pendientes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en getPendingTurnosByService:', error.response ? error.response.data : error.message);
    throw error;
  }
};



// --- FUNCIONES PARA ADMINISTRADOR ---
// Obtener todos los usuarios
export const getAllUsers = async () => {
  const response = await api.get('usuarios/');
  return response.data;
};

// Actualizar el rol de un usuario
export const updateUserRole = async (userId, newRole) => {
const response = await api.patch(`usuarios/${userId}/rol/`, { rol: newRole });
return response.data;
};

// Crear un nuevo usuario
export const createUser = async (userData) => {
return api.post('usuarios/', userData).then(res => res.data);
}

// Asignar punto de atención a profesional
export const assignPuntoToProfesional = (profesionalId, puntoAtencionId) => {
return api.post('asignar-punto/', { profesional_id: profesionalId, punto_atencion_id: puntoAtencionId }).then(res => res.data);
};

// Eliminar usuario por ID
export const deleteUsuario = async (userId) => {
  return api.delete(`usuarios/${userId}/`).then(res => res.data);
};

// Eliminar punto de atención por ID
export const deletePuntoAtencion = async (puntoId) => {
  return api.delete(`puntos-atencion/${puntoId}/`).then(res => res.data);
};

// Exporta la instancia api como exportación por defecto
export const enviarMensajeContacto = async (formData) => {
  try {
    // Usar tu instancia api existente que ya tiene la baseURL configurada
    const response = await api.post('contact/', formData);
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error en enviarMensajeContacto:', error);
    const errorMessage = error.response?.data?.error || 'Error al enviar el mensaje';
    throw new Error(errorMessage);
  }
};

export default api;
