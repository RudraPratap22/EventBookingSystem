import React, { useContext, useEffect, useState } from 'react';
import { BookingsContext } from '../context/BookingsContext';

const AdminBookings = () => {
  const { adminBookings, updateBookingStatus, deleteBooking, clearAdminView } = useContext(BookingsContext);
  const [processingId, setProcessingId] = useState(null);

  const handleApprove = async (id) => {
    setProcessingId(id);
    // Add delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    await updateBookingStatus(id, 'approved');
    setProcessingId(null);
  };

  const handleReject = async (id) => {
    setProcessingId(id);
    // Add delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    await updateBookingStatus(id, 'rejected');
    setProcessingId(null);
  };

  const handleDelete = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      deleteBooking(bookingId);
    }
  };

  // Filter to show only pending bookings
  const pendingBookings = adminBookings.filter(booking => booking.status === 'pending');

  if (!adminBookings || adminBookings.length === 0) {
    return (
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-8">Bookings</h1>
        <p className="text-gray-500">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="flex-grow p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Bookings</h1>
        <button
          onClick={clearAdminView}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
        >
          Clear Admin View
        </button>
      </div>
      <div className="overflow-x-auto">
        {pendingBookings.length === 0 ? (
          <p className="text-gray-500">No pending bookings to review.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Booking ID</th>
                <th className="px-4 py-2 border-b">Event Title</th>
                <th className="px-4 py-2 border-b">Customer</th>
                <th className="px-4 py-2 border-b">Date</th>
                <th className="px-4 py-2 border-b">Tickets</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
                <th className="px-4 py-2 border-b"></th> {/* Empty header for delete icon */}
              </tr>
            </thead>
            <tbody>
              {pendingBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-2 border-b">#{booking.id}</td>
                  <td className="px-4 py-2 border-b">{typeof booking.event === 'object' ? booking.event.title : booking.event || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{booking.customer || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{booking.formatted_date || booking.date || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">{booking.tickets || 'N/A'}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded ${
                      booking.status === 'pending' 
                        ? 'bg-yellow-200' 
                        : booking.status === 'approved' 
                          ? 'bg-green-200' 
                          : 'bg-red-200'
                    }`}>
                      {booking.status || 'pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(booking.id)}
                        disabled={processingId === booking.id}
                        className={`bg-black text-white py-1 px-2 rounded-lg transition-colors ${
                          processingId === booking.id 
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        {processingId === booking.id ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(booking.id)}
                        disabled={processingId === booking.id}
                        className={`bg-red-600 text-white py-1 px-2 rounded-lg transition-colors ${
                          processingId === booking.id 
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-red-700'
                        }`}
                      >
                        {processingId === booking.id ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={processingId === booking.id}
                      className={`hover:text-red-600 transition-colors cursor-pointer ${
                        processingId === booking.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Delete booking"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;