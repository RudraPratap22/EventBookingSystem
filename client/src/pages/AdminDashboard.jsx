import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="flex flex-col w-3/4 p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Total Events</h2>
          <p className="text-2xl font-bold">24</p>
          <p className="text-green-600">+12% from last month</p>
        </div>
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Total Bookings</h2>
          <p className="text-2xl font-bold">145</p>
          <p className="text-green-600">+18% from last month</p>
        </div>
        <div className="p-6 bg-white shadow rounded">
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl font-bold">$12,450</p>
          <p className="text-green-600">+25% from last month</p>
        </div>
       
      </div>
    </div>
  );
};

export default AdminDashboard;
