import React from 'react';
import AdminSidebar from './AdminSidebar';

const Adminlayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
};

export default Adminlayout;
