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
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTicketStatus = (tickets) => {
    if (tickets < 50) return { color: 'text-red-600 bg-red-50 border-red-200', text: 'Few tickets left!' };
    if (tickets < 200) return { color: 'text-orange-600 bg-orange-50 border-orange-200', text: 'Selling fast' };
    return { color: 'text-green-600 bg-green-50 border-green-200', text: 'Available' };
  };

  const ticketStatus = getTicketStatus(event.availableTickets);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Nav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Event Image */}
            <div className="relative">
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Price Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                    ${event.price}
                  </span>
                </div>
                
                {/* Ticket Status */}
                <div className="absolute top-6 right-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${ticketStatus.color}`}>
                    {ticketStatus.text}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {event.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {event.description || "Join us for an unforgettable experience at this amazing event."}
                </p>
              </div>

              {/* Event Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H9a2 2 0 01-2-2V8m8 0V9a2 2 0 01-2 2H9a2 2 0 01-2-2V8" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date & Time</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(event.date)}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Venue</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.venue}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Available Tickets</span>
                  </div>
                  <p className={`text-lg font-semibold ${
                    event.availableTickets < 100 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {event.availableTickets} remaining
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">Category</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {event.category || 'General'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button 
                  onClick={handleProceedToBook}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  {isLoggedIn ? 'Book Tickets Now' : 'Sign In to Book Tickets'}
                </button>
                
                {!isLoggedIn && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    You'll be redirected to sign in before booking
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Event Information</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your booking is protected with industry-standard security</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Best Price</h3>
              <p className="text-gray-600">Get the best deals on event tickets with no hidden fees</p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help anytime with our dedicated customer support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;