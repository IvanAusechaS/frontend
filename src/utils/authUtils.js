// utils/authUtils.js
export const normalizeUser = (user, formData = {}) => {
  return {
    id: user.id,
    cedula: user.cedula || formData.cedula || '',
    email: user.email || formData.email || '',
    nombre: user.nombre || formData.nombre || 'Usuario',
    es_profesional: user.es_profesional || formData.es_profesional || false,
    is_admin: user.is_admin || formData.is_admin || false,
    is_staff: user.is_staff || formData.is_staff || false,
    is_superuser: user.is_superuser || formData.is_superuser || false,
    rol: user.rol || formData.rol || (user.is_admin ? 'admin' : user.is_superuser ? 'superuser' : user.is_staff ? 'staff' : 'usuario'),
    punto_atencion_id_read: user.punto_atencion_id_read || null,
  };
};

export const updateLocalStorage = (access, refresh, user) => {
  localStorage.setItem('token', access);
  localStorage.setItem('refreshToken', refresh);
  localStorage.setItem('user', JSON.stringify(user));
};