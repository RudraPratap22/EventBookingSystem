import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import HeroSection from '../components/HeroSection';
import EvtCard from '../components/EvtCard';

const categoryBackgrounds = {
  Sports: 'https://upper90football.com/wp-content/uploads/2022/12/how-to-shoot-with-power.jpg',
  Technology: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0',
  Concert: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
  Conference: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
  'Food & Drink': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0'
};

const CatPage = ({ events }) => {
  const { category } = useParams();
  console.log('All events:', events); // Debug log
  console.log('Current category:', category); // Debug log
  const filteredEvents = events.filter(event => 
    event.category.toLowerCase() === category.toLowerCase()
  );
  console.log('Filtered events:', filteredEvents); // Debug log

  const getHeroBackground = (category) => {
    return categoryBackgrounds[category] || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30';
  };

  return (
    <div className="min-h-screen">
      <Nav />
      
      {/* Hero Section with Dynamic Background */}
      <section
        className="pt-20 bg-cover bg-center h-[100vh] relative" // Changed from h-screen to h-[50vh]
        style={{ backgroundImage: `url(${getHeroBackground(category)})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-5xl font-bold mb-4">{category}</h1>
          <p className="text-white text-lg md:text-xl mb-6">
            {getCategoryDescription(category)}
          </p>
        </div>
      </section>

      <section className="py-8 bg-gray-100">
        <h2 className="text-center text-3xl font-bold mb-8">{category} Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-12 justify-items-center">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EvtCard key={event.id} event={event} />
            ))
          ) : (
            <p>No events found for this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};

// Helper function to get category descriptions
const getCategoryDescription = (category) => {
  const descriptions = {
    Sports: "Experience the thrill of live sporting events",
    Technology: "Stay ahead with the latest tech conferences and workshops",
    Concert: "Immerse yourself in live music performances",
    Conference: "Connect with industry leaders and expand your network",
    'Food & Drink': "Savor culinary experiences and food festivals"
  };
  return descriptions[category] || "Discover amazing events";
};

export default CatPage;
