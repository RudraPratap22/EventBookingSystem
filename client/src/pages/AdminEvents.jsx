import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AdminEvents = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    price: '',
    location: '',
    category: '',
    image_url: '',
    total_tickets: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [events, setLocalEvents] = useState([]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/events', formData);
      setLocalEvents((prevEvents) => [...prevEvents, response.data]);
      setFormData({
        title: '',
        description: '',
        date: '',
        price: '',
        location: '',
        category: '',
        image_url: '',
        total_tickets: '',
      });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="flex">
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-8">Manage Events</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Hide Form' : 'Add Event'}
        </button>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl transition-colors"
              >
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['title', 'description', 'date', 'price', 'location', 'category', 'image_url', 'total_tickets'].map((field) => (
                    <div key={field}>
                      <label className="block text-gray-700 mb-2">
                        {field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}
                      </label>
                      <input
                        type={field === 'date' ? 'date' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
              </form>
            </div>
          </div>
        )}
        <div className="mt-8">
          <div className="grid grid-cols-5 gap-4 bg-gray-200 p-4 rounded-lg">
            <div className="font-semibold">Event</div>
            <div className="font-semibold">Date</div>
            <div className="font-semibold">Location</div>
            <div className="font-semibold">Capacity</div>
            <div className="font-semibold">Price</div>
          </div>
          {events.map((event) => (
            <div key={event.id} className="grid grid-cols-5 gap-4 p-4 border-b">
              <div>{event.title}</div>
              <div>{event.date}</div>
              <div>{event.location}</div>
              <div>{event.total_tickets}</div>
              <div>${event.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;
