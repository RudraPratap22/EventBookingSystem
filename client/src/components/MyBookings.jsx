import React, { useContext, useState } from 'react';
import { BookingsContext } from '../context/BookingsContext';
import Nav from './Nav';
import CancelBookingModal from './CancelBookingModal';
import RefundModal from './RefundModal';

const MyBookings = () => {
  const { userBookings, cancelBooking } = useContext(BookingsContext);
  const userName = localStorage.getItem('userName');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  console.log('User bookings:', userBookings); // Debug log
  console.log('Current user:', userName); // Debug log

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    cancelBooking(selectedBookingId);
    setShowCancelModal(false);
    setShowRefundModal(true);
  };

  const filteredBookings = userBookings.filter(booking => {
    const customerName = booking.customer?.toLowerCase() || '';
    const currentUser = userName?.toLowerCase() || '';
    return customerName.includes(currentUser);
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Nav isScrolled={true} />
      <div className="flex-grow bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
          
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">No bookings found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.event}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.tickets}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : booking.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleCancelClick(booking.id)}
                          className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                          disabled={booking.status === 'cancelled'}
                        >
                          Cancel Booking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <CancelBookingModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
      
      <RefundModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
      />
    </div>
  );
};

export default MyBookings;
