import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EvtCard = ({ event }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    navigate(`/booking/${event.title}`, { state: { event } });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTicketStatus = (tickets) => {
    if (tickets < 50) return { color: 'text-red-600 bg-red-50', text: 'Few left!' };
    if (tickets < 200) return { color: 'text-orange-600 bg-orange-50', text: 'Selling fast' };
    return { color: 'text-green-600 bg-green-50', text: 'Available' };
  };

  const ticketStatus = getTicketStatus(event.remaining_tickets || event.availableTickets);

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            setImageError(true);
            e.target.src = '/assets/images/event-placeholder.jpg';
          }}
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            ₹{event.price}
          </span>
        </div>
        
        {/* Ticket Status */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ticketStatus.color}`}>
            {ticketStatus.text}
          </span>
        </div>
        
        {/* Date Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center min-w-[60px]">
          <div className="text-xs font-semibold text-gray-600 uppercase">
            {formatDate(event.formatted_date || event.date).split(' ')[0]}
          </div>
          <div className="text-lg font-bold text-gray-900">
            {formatDate(event.formatted_date || event.date).split(' ')[1].replace(',', '')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm truncate">{event.venue}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm">{event.remaining_tickets || event.availableTickets} tickets available</span>
          </div>
        </div>
        
        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform group-hover:scale-105">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default EvtCard;