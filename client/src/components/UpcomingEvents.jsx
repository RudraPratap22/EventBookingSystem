import React from "react";
import EvtCard from "./EvtCard";
import coldPlay from "../assets/images/coldPlay.avif";
import virtual from "../assets/images/virtualimage.png";

const hardcodedEvents = [
  {
    id: 1001,
    title: "Music Show",
    date: "Dec 30, 2024",
    price: "50",
    image: coldPlay,
    venue: "Madison Square Garden, NY",
    availableTickets: 500,
  },
  {
    id: 1002,
    title: "IND VS AUS",
    date: "Jan 15, 2025",
    price: "25",
    image: virtual,
    venue: "MCG, Melbourne",
    availableTickets: 1000,
  },
  {
    id: 1003,
    title: "India's Got Talent",
    date: "Feb 20, 2025",
    price: "30",
    image: virtual,
    venue: "Mumbai, India",
    availableTickets: 750,
  },
];

const UpcomingEvents = ({ events = [] }) => {
  const displayEvents = events.length > 0 ? events : hardcodedEvents;

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing events happening soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <EvtCard key={event.id} event={event} />
          ))}
        </div>

        {displayEvents.length > 6 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
              View All Events
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;