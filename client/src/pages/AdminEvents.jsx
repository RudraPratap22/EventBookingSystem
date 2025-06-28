import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UnsplashImagePicker from '../components/UnsplashImagePicker';

function DeleteConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full relative">
        <h2 className="text-xl font-bold mb-4">Delete Event</h2>
        <p className="mb-6 text-gray-700">Are you sure you want to delete this event?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [editingId, setEditingId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await axios.put(`http://localhost:5000/api/events/${editingId}`, formData);
        setLocalEvents(events => events.map(e => e.id === editingId ? response.data : e));
        setEditingId(null);
      } else {
        const response = await axios.post('http://localhost:5000/api/events', formData);
        setLocalEvents((prevEvents) => [...prevEvents, response.data]);
      }
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
      console.error('Error adding/updating event:', error);
    }
  };

  const handleImageSelect = (imageUrl) => {
    setFormData({ ...formData, image_url: imageUrl });
  };

  const cleanupDummyEvents = async () => {
    if (!window.confirm('This will delete all events with invalid image URLs. Are you sure?')) {
      return;
    }
    
    try {
      const response = await axios.delete('http://localhost:5000/api/events/cleanup-dummy-images');
      alert(response.data.message);
      // Refresh the events list
      window.location.reload();
    } catch (error) {
      console.error('Error cleaning up events:', error);
      alert('Error cleaning up events. Please try again.');
    }
  };

  useEffect(() => {
    // Fetch events from backend on mount
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setLocalEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    setEventToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventToDelete}`);
      setLocalEvents(events => events.filter(e => e.id !== eventToDelete));
    } catch (error) {
      alert('Failed to delete event.');
      console.error(error);
    }
    setDeleteModalOpen(false);
    setEventToDelete(null);
  };

  // Edit event
  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      price: event.price,
      location: event.venue || event.location,
      category: event.category,
      image_url: event.image,
      total_tickets: event.total_tickets,
    });
    setShowForm(true);
    setEditingId(event.id);
  };

  return (
    <div className="flex">
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-8">Manage Events</h1>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add Event'}
          </button>
        </div>
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative bg-white rounded-lg shadow-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-3xl transition-colors"
              >
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['title', 'description', 'date', 'price', 'location', 'category', 'total_tickets'].map((field) => (
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
                
                {/* Image Picker Section */}
                <div className="mt-6">
                  <label className="block text-gray-700 mb-2">
                    Event Image
                  </label>
                  <UnsplashImagePicker 
                    onSelect={handleImageSelect}
                    currentImageUrl={formData.image_url}
                  />
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
            <div key={event.id} className="grid grid-cols-5 gap-4 p-4 border-b items-center">
              <div>{event.title}</div>
              <div>{event.date}</div>
              <div>{event.location || event.venue}</div>
              <div>{event.total_tickets}</div>
              <div className="flex items-center gap-2">
                <span>₹{event.price}</span>
                <button onClick={() => handleEdit(event)} className="ml-2 px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AdminEvents;
