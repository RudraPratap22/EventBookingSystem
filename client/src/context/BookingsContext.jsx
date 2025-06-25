import React, { createContext, useState, useEffect } from 'react';

export const BookingsContext = createContext();

export const BookingsProvider = ({ children }) => {
  const [adminBookings, setAdminBookings] = useState(() => {
    const savedAdminBookings = localStorage.getItem('adminBookings');
    return savedAdminBookings ? JSON.parse(savedAdminBookings) : [];
  });

  const [userBookings, setUserBookings] = useState(() => {
    const savedUserBookings = localStorage.getItem('userBookings');
    return savedUserBookings ? JSON.parse(savedUserBookings) : [];
  });

  // Save admin bookings to localStorage
  useEffect(() => {
    localStorage.setItem('adminBookings', JSON.stringify(adminBookings));
  }, [adminBookings]);

  // Save user bookings to localStorage
  useEffect(() => {
    localStorage.setItem('userBookings', JSON.stringify(userBookings));
  }, [userBookings]);

  const addBooking = (newBooking) => {
    console.log('Adding new booking to admin:', newBooking);
    setAdminBookings(prevBookings => [...prevBookings, newBooking]);
    setUserBookings(prevBookings => [...prevBookings, newBooking]);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    // Remove from admin view when approved/rejected
    setAdminBookings(prevBookings => 
      prevBookings.filter(booking => {
        if (booking.id === bookingId) {
          return false; // Remove this booking
        }
        return true; // Keep other bookings
      })
    );

    // Update status in user bookings
    setUserBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  const cancelBooking = (bookingId) => {
    setUserBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== bookingId)
    );
    setAdminBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )
    );
  };

  const deleteBooking = (bookingId) => {
    setAdminBookings(prevBookings => 
      prevBookings.filter(booking => booking.id !== bookingId)
    );
  };

  const clearAdminView = () => {
    setAdminBookings([]);
    localStorage.removeItem('adminBookings');
  };

  const updateTicketCount = async (eventId, ticketsBooked) => {
    try {
      // Update events in localStorage
      const events = JSON.parse(localStorage.getItem('events')) || [];
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            availableTickets: event.availableTickets - ticketsBooked
          };
        }
        return event;
      });
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      return true;
    } catch (error) {
      console.error('Error updating ticket count:', error);
      return false;
    }
  };

  return (
    <BookingsContext.Provider value={{ 
      adminBookings, 
      userBookings, 
      addBooking, 
      updateBookingStatus,
      cancelBooking,
      deleteBooking, 
      clearAdminView,
      updateTicketCount 
    }}>
      {children}
    </BookingsContext.Provider>
  );
};