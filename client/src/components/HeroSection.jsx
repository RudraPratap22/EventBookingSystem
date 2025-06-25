import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';

const HeroSection = ({ events, categories }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [progress, setProgress] = useState(0); // Progress bar width

  const isCategoryPage = location.pathname.startsWith('/category');

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value) {
      const matchedSuggestions = [
        ...categories.filter((category) => category.toLowerCase().includes(value)),
        ...events
          .filter((event) => event.title.toLowerCase().includes(value))
          .map((event) => event.title),
      ];
      setSuggestions(matchedSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (query) {
      const categoryMatch = categories.find((category) => category.toLowerCase() === query.toLowerCase());
      const eventMatch = events.find((event) => event.title.toLowerCase() === query.toLowerCase());

      setLoading(true); // Start loading before navigation

      let currentProgress = 0;

      const interval = setInterval(() => {
        currentProgress += 10; // Increase progress by 10% every 50ms for faster animation
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(interval);
          setLoading(false); // Stop loading after 100% progress

          if (categoryMatch) {
            navigate(`/category/${categoryMatch}`);
          } else if (eventMatch) {
            navigate(`/booking/${eventMatch.title}`, { state: { event: eventMatch } });
          } else {
            alert('No matching category or event found.');
          }
        }
      }, 50); // Update progress bar every 50ms
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    const categoryMatch = categories.find((category) => category.toLowerCase() === suggestion.toLowerCase());
    const eventMatch = events.find((event) => event.title.toLowerCase() === suggestion.toLowerCase());

    setLoading(true); // Start loading before navigation
    setProgress(0); // Reset progress bar before new search

    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10; // Increase progress by 10% every 50ms for faster animation
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setLoading(false);

        if (categoryMatch) {
          navigate(`/category/${categoryMatch}`);
        } else if (eventMatch) {
          navigate(`/booking/${eventMatch.title}`, { state: { event: eventMatch } });
        }
      }
    }, 50); // Update progress bar every 50ms
  };

  return (
    <section
      className="pt-20 bg-cover bg-center h-screen relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center ${
          isCategoryPage ? 'items-start pl-20' : 'items-center'
        } text-left`}
      >
        {isCategoryPage ? (
          <h1 className="text-white text-5xl font-bold mb-4">{location.pathname.split('/')[2]} Events</h1>
        ) : (
          <h1 className="text-white text-4xl font-bold mb-4">Connecting the World</h1>
        )}

        <p className="text-white mb-6">Find the best events near you</p>

        {/* Search Bar */}
        {!isCategoryPage && (
          <div className="relative w-full max-w-xl">
            <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden w-full">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Enter keywords..."
                className="p-3 w-full border-none focus:outline-none text-lg"
              />
              <button
                onClick={handleSearch}
                className="bg-red-500 text-white px-6 py-3 rounded-r-lg focus:outline-none text-lg"
              >
                Search
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto z-10 shadow-md">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 cursor-pointer hover:bg-gray-200 text-lg"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* YouTube-like Progress Bar */}
        {loading && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-300">
            <div
              className="bg-red-500 h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
