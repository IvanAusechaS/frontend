import React, { useState, useEffect } from 'react';
import { getTickets, createTicket } from './services/api';

function App() {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ usuario: '', descripcion: '' });

  // Cargar tickets al iniciar
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Enviar nuevo ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTicket = await createTicket({ ...formData, estado: 'Pendiente' });
      setTickets([...tickets, newTicket]);
      setFormData({ usuario: '', descripcion: '' });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <div>
      <h1>Sistema de Atención a Usuarios</h1>
      <h2>Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            {ticket.usuario} - {ticket.descripcion} ({ticket.estado})
          </li>
        ))}
      </ul>

      <h2>Crear Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="usuario"
          value={formData.usuario}
          onChange={handleChange}
          placeholder="Usuario"
          required
        />
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          required
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default App;