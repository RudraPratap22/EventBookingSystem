import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { 
    name: 'Business', 
    icon: '💼',
    color: 'from-blue-500 to-blue-600',
    description: 'Professional networking & conferences'
  },
  { 
    name: 'Concert', 
    icon: '🎤',
    color: 'from-purple-500 to-pink-500',
    description: 'Live music & performances'
  },
  { 
    name: 'Comedy', 
    icon: '😂',
    color: 'from-yellow-500 to-orange-500',
    description: 'Stand-up & entertainment shows'
  },
  { 
    name: 'Sports', 
    icon: '⚽',
    color: 'from-green-500 to-emerald-500',
    description: 'Athletic events & competitions'
  },
  { 
    name: 'Conference', 
    icon: '🎓',
    color: 'from-indigo-500 to-purple-500',
    description: 'Educational & professional talks'
  },
  { 
    name: 'Festival', 
    icon: '🎉',
    color: 'from-pink-500 to-rose-500',
    description: 'Cultural celebrations & festivals'
  },
];

const Categories = () => {
  return (
    <section id="categories" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover events that match your interests and passions
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={`/category/${category.name}`}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-8 text-center">
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${category.color} text-white text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-800">
                  {category.name}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Explore Events</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
              
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;