import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EvtCard = ({ event }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  console.log(event); // Debug log to verify that `id` exists in the event object


  const handleClick = () => {
    navigate(`/booking/${event.title}`, { state: { event } });
  };

  return (
    <div 
      className="w-full h-[400px] bg-white rounded-lg shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 flex flex-col" 
      onClick={handleClick}
    >
      {/* Fixed Height Image Container */}
      <div className="relative h-[200px] w-full">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            setImageError(true);
            e.target.src = '/assets/images/event-placeholder.jpg';
          }}
          loading="lazy"
        />
        {/* Tickets Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium">
          {event.remaining_tickets || event.availableTickets} tickets left
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        </div>
        <div className="flex justify-between items-end mt-auto">
          <div className="text-gray-600">
            <p>{event.formatted_date || event.date}</p>
            <p>{event.venue}</p>
          </div>
          <p className="text-blue-600 font-semibold">${event.price}</p>
        </div>
      </div>
    </div>
  );
};

export default EvtCard;