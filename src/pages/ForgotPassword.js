// frontend/src/pages/ForgotPassword.js (nuevo archivo opcional)
import React from 'firebase/auth';
import { auth } from '../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = React.useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Correo de recuperación enviado');
    } catch (err) {
      alert('Error al enviar el correo');
    }
  };

  return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleResetPassword}>Recuperar contraseña</button>
    </div>
  );
};
export default ForgotPassword;