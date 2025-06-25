import React, { useState, useContext } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { BookingsContext } from '../context/BookingsContext';

const BookingPage = ({ events }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventTitle } = useParams();
  const event = location.state?.event || events.find(e => e.title === eventTitle);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const { setBookings } = useContext(BookingsContext);

  const [formData, setFormData] = useState({
    event_id: event?.id || '',
    user_id: '',
    date: '',
    tickets: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBooking = {
        id: Date.now(), // Generate a unique ID for the booking
        event: event.title,
        customer: formData.user_id,
        date: formData.date,
        tickets: formData.tickets,
        status: 'pending',
      };
      setBookings(prevBookings => [...prevBookings, newBooking]);
      alert('Booking successful!');
      navigate('/admin/bookings');
    } catch (error) {
      console.error('Error making booking:', error);
    }
  };

  const handleProceedToBook = () => {
    if (!isLoggedIn) {
      localStorage.setItem("prevPage", window.location.pathname);
      localStorage.setItem("bookingEvent", JSON.stringify(event));
      navigate('/login');
      return;
    }
    navigate('/book-tickets', { state: { event } });
  };

  if (!event) {
    return <div>No event data found.</div>;
  }

  return (
    <div>
      <Nav />
      <section className="py-8 bg-gray-100 min-h-screen mt-20">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div
            className="h-60 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.image})` }}
          ></div>
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Price:</span> ${event.price}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Venue:</span> {event.venue}
                </p>
                <p className="text-green-600">
                  <span className="font-semibold">Available Tickets:</span> {event.availableTickets}
                </p>
              </div>
            </div>
            <button 
              onClick={handleProceedToBook}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Proceed to Book
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;