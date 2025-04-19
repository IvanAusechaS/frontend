export const normalizeUser = (user, formData = {}) => {
    return {
      id: user.id,
      cedula: user.cedula || formData.cedula || '',
      email: user.email || formData.email || '',
      nombre: user.nombre || formData.nombre || 'Usuario',
      es_profesional: user.es_profesional || formData.es_profesional || false,
    };
  };
  
  export const updateLocalStorage = (access, refresh, user) => {
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('user', JSON.stringify(user));
  };