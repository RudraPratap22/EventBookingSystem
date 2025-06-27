import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/Nav';
import EvtCard from '../components/EvtCard';

const categoryData = {
  Sports: {
    background: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Experience the thrill of live sporting events and competitions',
    icon: '⚽',
    color: 'from-green-500 to-emerald-600'
  },
  Technology: {
    background: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80',
    description: 'Stay ahead with cutting-edge tech conferences and workshops',
    icon: '💻',
    color: 'from-blue-500 to-cyan-600'
  },
  Concert: {
    background: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Immerse yourself in unforgettable live music performances',
    icon: '🎤',
    color: 'from-purple-500 to-pink-600'
  },
  Conference: {
    background: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Connect with industry leaders and expand your professional network',
    icon: '🎓',
    color: 'from-indigo-500 to-purple-600'
  },
  'Food & Drink': {
    background: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Savor culinary experiences and gourmet food festivals',
    icon: '🍷',
    color: 'from-orange-500 to-red-600'
  },
  Business: {
    background: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Professional networking and business development events',
    icon: '💼',
    color: 'from-gray-600 to-blue-700'
  },
  Comedy: {
    background: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Laugh out loud with the best stand-up comedy shows',
    icon: '😂',
    color: 'from-yellow-500 to-orange-600'
  },
  Festival: {
    background: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    description: 'Celebrate culture and community at vibrant festivals',
    icon: '🎉',
    color: 'from-pink-500 to-rose-600'
  }
};

const CatPage = ({ events }) => {
  const { category } = useParams();
  const categoryInfo = categoryData[category] || categoryData['Sports'];
  
  const filteredEvents = events.filter(event => 
    event.category && event.category.toLowerCase() === category.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      {/* Enhanced Hero Section */}
      <section
        className="relative pt-20 bg-cover bg-center h-[70vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${categoryInfo.background})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Category Icon */}
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${categoryInfo.color} text-white text-4xl mb-6 animate-bounce`}>
              {categoryInfo.icon}
            </div>
            
            {/* Title */}
            <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight">
              {category}
              <span className="block text-3xl md:text-4xl font-normal text-blue-400 mt-4">
                Events
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              {categoryInfo.description}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{filteredEvents.length}</div>
                <div className="text-sm text-gray-300">Available Events</div>
              </div>
              <div className="w-px h-12 bg-gray-400"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {filteredEvents.reduce((total, event) => total + (event.availableTickets || 0), 0)}
                </div>
                <div className="text-sm text-gray-300">Total Tickets</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upcoming {category} Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these amazing {category.toLowerCase()} events happening soon
            </p>
            <div className={`w-24 h-1 bg-gradient-to-r ${categoryInfo.color} mx-auto mt-6 rounded-full`}></div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EvtCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${categoryInfo.color} text-white text-3xl mb-6`}>
                {categoryInfo.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We don't have any {category.toLowerCase()} events scheduled at the moment. 
                Check back soon for exciting new events!
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105">
                Browse All Events
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredEvents.length > 6 && (
            <div className="text-center mt-12">
              <button className={`bg-gradient-to-r ${categoryInfo.color} text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105`}>
                Load More {category} Events
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`py-20 bg-gradient-to-r ${categoryInfo.color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Experience {category}?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of others who have discovered amazing {category.toLowerCase()} events through EventHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
              Browse All Categories
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-all transform hover:scale-105">
              Create Event Alert
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatPage;