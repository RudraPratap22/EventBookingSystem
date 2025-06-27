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

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Nav isScrolled={true} />
      
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-xl text-gray-600">Manage your event bookings and tickets</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mt-4 rounded-full"></div>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Bookings Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't made any bookings yet. Start exploring amazing events and book your first ticket!
              </p>
              <a 
                href="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
              >
                Browse Events
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      {/* Booking Info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {booking.event}
                            </h3>
                            <p className="text-gray-600">
                              Booking ID: #{booking.id}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1m7-1l1 1m-1-1v4a2 2 0 01-2 2H9a2 2 0 01-2-2V8m8 0V9a2 2 0 01-2 2H9a2 2 0 01-2-2V8" />
                            </svg>
                            <span className="text-gray-600">{booking.date}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-gray-600">{booking.tickets} ticket{booking.tickets > 1 ? 's' : ''}</span>
                          </div>
                          
                          {booking.total && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="text-gray-600 font-semibold">${booking.total}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-3">
                        {booking.status === 'approved' && (
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                            Download Ticket
                          </button>
                        )}
                        
                        {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                          <button
                            onClick={() => handleCancelClick(booking.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            Cancel Booking
                          </button>
                        )}
                        
                        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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