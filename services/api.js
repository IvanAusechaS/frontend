import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/';

export const getTickets = async () => {
    const response = await axios.get(`${API_URL}tickets/`);
    return response.data;
};

export const createTicket = async (ticketData) => {
    const response = await axios.post(`${API_URL}tickets/`, ticketData);
    return response.data;
};