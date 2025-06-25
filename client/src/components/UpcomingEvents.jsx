import React from "react";
import EvtCard from "./EvtCard"; // Import the reusable EventCard component
import coldPlay from "../assets/images/coldPlay.avif"; // Path updated to src/assets
import virtual from "../assets/images/virtualimage.png"; // Path updated to src/assets

// Hardcoded events
const hardcodedEvents = [
  {
    id: 1001, // Unique ID
    title: "Music Show",
    date: "Dec 30, 2024",
    price: "50",
    image: coldPlay,
    venue: "Madison Square Garden, NY",
    availableTickets: 500,
  },
  {
    id: 1002, // Unique ID
    title: "IND VS AUS",
    date: "Jan 15, 2025",
    price: "25",
    image: virtual,
    venue: "MCG, Melbourne",
    availableTickets: 1000,
  },
  {
    id: 1003, // Unique ID
    title: "India's Got Talent",
    date: "Feb 20, 2025",
    price: "30",
    image: virtual,
    venue: "Mumbai, India",
    availableTickets: 750,
  },
];

const UpcomingEvents = ({ events = [] }) => {
  return (
    <section className="py-8 bg-gray-100">
      <h2 className="text-center text-3xl font-bold mb-8">Upcoming Events</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-12 justify-items-center">
        {events.length > 0 ? (
          events.map((event) => (
            <EvtCard key={event.id} event={event} />
          ))
        ) : (
          hardcodedEvents.map((event) => (
            <EvtCard key={event.id} event={event} />
          ))
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
