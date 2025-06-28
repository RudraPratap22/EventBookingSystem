import React, { useContext, useState } from 'react';
import { BookingsContext } from '../context/BookingsContext';
import Nav from './Nav';
import CancelBookingModal from './CancelBookingModal';
import RefundModal from './RefundModal';
import jsPDF from 'jspdf';

const BookingDetailsModal = ({ isOpen, onClose, booking }) => {
  if (!isOpen || !booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-2xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
        <div className="space-y-2">
          <div><span className="font-semibold">Event:</span> {booking.event}</div>
          <div><span className="font-semibold">Booking ID:</span> {booking.id}</div>
          <div><span className="font-semibold">Date:</span> {booking.date}</div>
          <div><span className="font-semibold">Tickets:</span> {booking.tickets}</div>
          {booking.total && <div><span className="font-semibold">Total:</span> ₹{booking.total}</div>}
          <div><span className="font-semibold">Status:</span> {booking.status}</div>
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const { userBookings, cancelBooking } = useContext(BookingsContext);
  const userName = localStorage.getItem('userName');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    cancelBooking(selectedBookingId);
    setShowCancelModal(false);
    setShowRefundModal(true);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const filteredBookings = userBookings.filter(booking => {
    const customerName = booking.customer?.toLowerCase() || '';
    const currentUser = userName?.toLowerCase() || '';
    return customerName.includes(currentUser);
  });

  // Helper to compare only the date part
  function isSameOrAfterToday(dateStr) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    eventDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return eventDate >= today;
  }

  const upcomingBookings = filteredBookings.filter(booking => isSameOrAfterToday(booking.date));
  const pastBookings = filteredBookings.filter(booking => !isSameOrAfterToday(booking.date));

  const [showPast, setShowPast] = useState(false);

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

  // PDF download handler
  const handleDownloadTicket = (booking) => {
    const doc = new jsPDF();
    // Header (white background)
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 10, 190, 22, 'F');
    // Draw blue-to-purple gradient square (approximate)
    const gradSteps = 16;
    const startColor = [59, 130, 246]; // blue-600
    const endColor = [168, 85, 247]; // purple-500
    for (let i = 0; i < gradSteps; i++) {
      const ratio = i / (gradSteps - 1);
      const r = Math.round(startColor[0] * (1 - ratio) + endColor[0] * ratio);
      const g = Math.round(startColor[1] * (1 - ratio) + endColor[1] * ratio);
      const b = Math.round(startColor[2] * (1 - ratio) + endColor[2] * ratio);
      doc.setFillColor(r, g, b);
      doc.roundedRect(16, 13 + i, 16, 1, 4, 4, 'F');
    }
    // Draw white bold 'E' perfectly centered in the square
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    // Center at (16,13) + 8,8 = (24,21)
    doc.text('E', 24, 21.5, { align: 'center', baseline: 'middle' });
    // 'Event' (bold, dark)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(33, 37, 41);
    doc.text('Event', 36, 23);
    // 'Hub' (bold, blue)
    doc.setTextColor(37, 99, 235);
    doc.text('Hub', 56, 23);
    // Thin accent line
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.line(10, 32, 200, 32);
    // Details box
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.roundedRect(20, 38, 170, 60, 3, 3);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text(`Event:`, 28, 50);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(33, 37, 41);
    doc.text(booking.event, 60, 50);
    let y = 58;
    doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235); doc.text('Booking ID:', 28, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(33, 37, 41); doc.text(String(booking.id), 60, y);
    y += 8;
    doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235); doc.text('Date:', 28, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(33, 37, 41); doc.text(booking.date, 60, y);
    y += 8;
    if (booking.venue) {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235); doc.text('Venue:', 28, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(33, 37, 41); doc.text(booking.venue, 60, y);
      y += 8;
    }
    doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235); doc.text('Tickets:', 28, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(33, 37, 41); doc.text(String(booking.tickets), 60, y);
    y += 8;
    if (booking.total) {
      doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235); doc.text('Total:', 28, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(33, 37, 41);
      const totalValue = typeof booking.total === 'number' ? booking.total : parseFloat(booking.total.toString().replace(/[^\d.]/g, ''));
      doc.text(`₹${totalValue.toLocaleString('en-IN')}`, 60, y);
      y += 8;
    }
    doc.setFont('helvetica', 'bold'); doc.setTextColor(37, 99, 235); doc.text('Status:', 28, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(33, 37, 41); doc.text(booking.status.charAt(0).toUpperCase() + booking.status.slice(1), 60, y);
    // Thank you message
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for booking with EventHub!', 105, y + 20, { align: 'center' });
    doc.save(`Ticket_${booking.id}.pdf`);
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

          {/* Tabs for Upcoming and Past */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowPast(false)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${!showPast ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setShowPast(true)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${showPast ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Past
            </button>
          </div>

          {(showPast ? pastBookings : upcomingBookings).length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Bookings Yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {showPast
                  ? "You don't have any past bookings."
                  : "You haven't made any bookings yet. Start exploring amazing events and book your first ticket!"}
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
              {(showPast ? pastBookings : upcomingBookings).map((booking) => (
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
                              <span className="text-gray-600 font-semibold">₹{booking.total}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row gap-3">
                        {showPast ? (
                          <button
                            onClick={() => handleViewDetails(booking)}
                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            View Details
                          </button>
                        ) : (
                          <>
                            {booking.status === 'approved' && (
                              <button
                                onClick={() => handleDownloadTicket(booking)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                              >
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
                            <button
                              onClick={() => handleViewDetails(booking)}
                              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                              View Details
                            </button>
                          </>
                        )}
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

      <BookingDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default MyBookings;