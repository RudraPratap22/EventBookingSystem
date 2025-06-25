import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backgroundImage from '../assets/images/background.jpg';

const HeroSection = ({ events, categories }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

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

      setLoading(true);

      setTimeout(() => {
        setLoading(false);
        if (categoryMatch) {
          navigate(`/category/${categoryMatch}`);
        } else if (eventMatch) {
          navigate(`/booking/${eventMatch.title}`, { state: { event: eventMatch } });
        } else {
          alert('No matching category or event found.');
        }
      }, 1000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    const categoryMatch = categories.find((category) => category.toLowerCase() === suggestion.toLowerCase());
    const eventMatch = events.find((event) => event.title.toLowerCase() === suggestion.toLowerCase());

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (categoryMatch) {
        navigate(`/category/${categoryMatch}`);
      } else if (eventMatch) {
        navigate(`/booking/${eventMatch.title}`, { state: { event: eventMatch } });
      }
    }, 1000);
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
      
      {/* Loading Bar */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {isCategoryPage ? (
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              {location.pathname.split('/')[2]} 
              <span className="block text-3xl md:text-4xl font-normal text-blue-400 mt-2">Events</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover amazing {location.pathname.split('/')[2].toLowerCase()} events happening near you
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Events
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Connect with the world through unforgettable experiences. Find concerts, conferences, sports events, and more.
              </p>
            </div>

            {/* Search Section */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search for events, categories..."
                  className="w-full pl-12 pr-32 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-full shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </div>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-gray-800">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{events.length}+</div>
                <div className="text-sm text-gray-300">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-300">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-gray-300">Cities</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      {!isCategoryPage && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  );
};

export default HeroSection;