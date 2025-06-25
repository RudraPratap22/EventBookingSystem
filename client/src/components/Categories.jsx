import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Business', icon: '💼' },
  { name: 'Concert', icon: '🎤' },
  { name: 'Comedy', icon: '🍔' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Conference', icon: '🎓' },
  { name: 'Festival', icon: '🎉' },
];

const Categories = () => {
  return (
    <section className="py-8 bg-gray-100">
      <h2 className="text-center text-2xl font-bold mb-6">Categories</h2>
      <div className="flex justify-center space-x-6">
        {categories.map((category, index) => (
          <Link key={index} to={`/category/${category.name}`}>
            <div className="text-center cursor-pointer">
              <span className="text-4xl">{category.icon}</span>
              <p className="mt-2">{category.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
