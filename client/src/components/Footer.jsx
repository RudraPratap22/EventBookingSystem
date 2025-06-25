import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">About EventUp</h3>
          <p className="text-sm">
            EventUp is your ultimate destination for discovering and booking exciting events near you.
            Connect with the world through concerts, conferences, and more!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul>
            <li className="mb-2">
              <a href="/about" className="hover:underline">About Us</a>
            </li>
            <li className="mb-2">
              <a href="/events" className="hover:underline">Events</a>
            </li>
            <li className="mb-2">
              <a href="/contact" className="hover:underline">Contact</a>
            </li>
            <li>
              <a href="/login" className="hover:underline">Login/Register</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">Email: support@eventup.com</p>
          <p className="text-sm">Phone: +1 234 567 890</p>
          <p className="text-sm">Address: 123 EventUp Street, City, Country</p>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-600 pt-4">
        &copy; 2024 EventUp. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
