import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <div className="w-1/4 bg-gray-800 h-screen text-white">
      <div className="p-4 text-2xl font-bold">Event Admin</div>
      <ul className="mt-4">
        <li className="p-4 hover:bg-gray-700">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link to="/admin/events">Events</Link>
        </li>
        <li className="p-4 hover:bg-gray-700">
          <Link to="/admin/bookings">Bookings</Link>
        </li>

      </ul>
    </div>
  );
};

export default AdminSidebar;
