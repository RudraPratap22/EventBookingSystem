import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const eventService = {
  fetchEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events`);
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  updateTickets: async (eventId, quantity) => {
    try {
      console.log("Event ID:", eventId); // Debug log
      console.log("Quantity:", quantity); // Debug log
      if (!eventId) throw new Error('Event ID is required');
  
      const response = await axios.put(`${API_URL}/api/events/update-tickets/${eventId}`, {
        quantity: parseInt(quantity)
      });
  
      console.log('Update response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error updating tickets:', error);
      throw error;
    }
  }
  
};

export default eventService;