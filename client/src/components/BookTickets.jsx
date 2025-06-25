import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import PaymentModal from "./PaymentModal";
import { initiatePayment } from "../services/razorpay";
import axios from "axios";
import eventService from "../services/eventService";
import { BookingsContext } from '../context/BookingsContext';

const calculateTotal = (event, quantity) => {
  if (!event || !event.price) return 0;

  // Convert price to string and remove any existing $ symbol
  const priceString = event.price.toString();
  const cleanPrice = priceString.replace(/[$,]/g, "");

  // Convert to float and calculate total
  const price = parseFloat(cleanPrice);
  return price * quantity;
};

const BookTickets = ({ events, setEvents }) => {
  const location = useLocation();
  const event = location.state?.event;
  const [selectedEvent, setSelectedEvent] = useState(event || null);
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { addBooking, updateTicketCount } = useContext(BookingsContext);

  useEffect(() => {
    if (event) {
      setSelectedEvent(event);
    }
  }, [event]);

  const getImagePath = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return image;
    return `/assets/images/${image}.jpg`;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      const userName = localStorage.getItem('userName');
      const newBooking = {
        id: Date.now(),
        event: event.title,
        customer: userName || `${formData.firstName} ${formData.lastName}`,
        date: new Date().toLocaleDateString(),
        tickets: ticketCount,
        status: 'pending',
        email: formData.email,
        phone: formData.phone,
        total: calculateTotal(event, ticketCount).toFixed(2),
        paymentId: paymentResponse.razorpay_payment_id
      };

      // Update ticket count
      await updateTicketCount(event.id, ticketCount);

      // Update local events state
      const updatedEvents = events.map(evt => {
        if (evt.id === event.id) {
          return {
            ...evt,
            availableTickets: evt.availableTickets - ticketCount
          };
        }
        return evt;
      });
      setEvents(updatedEvents);

      addBooking(newBooking);

      navigate('/payment-success', {
        state: {
          event,
          ticketCount,
          total: calculateTotal(event, ticketCount).toFixed(2),
          paymentId: paymentResponse.razorpay_payment_id,
          isPending: true
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setErrors({ submit: "Booking failed. Please try again." });
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);
    setErrors({ submit: "Payment failed. Please try again." });
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    try {
      await initiatePayment(calculateTotal(selectedEvent, ticketCount).toFixed(2), {
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        phone: formData.phone,
        handler: handlePaymentSuccess,
      });
    } catch (error) {
      setErrors({ submit: "Payment failed. Please try again." });
    }
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const userName = localStorage.getItem('userName');
    
    const newBooking = {
      id: Date.now(),
      event: event.title,
      customer: userName || 'Guest User',
      date: new Date().toISOString().split('T')[0],
      tickets: e.target.tickets.value,
      status: 'pending'
    };

    console.log('Creating new booking:', newBooking); // Debug log
    addBooking(newBooking);
    navigate('/payment-success');
  };

  if (!event) {
    return <div className="text-center py-12">No event data found.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Nav isScrolled={true} />
      <div className="flex-grow bg-gray-100 pt-24 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column */}
            <div className="lg:w-[70%] space-y-6">
              {/* Event Details with Image */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div
                  className="h-64 w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${getImagePath(event.image)})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {event.title}
                  </h1>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Date:</p>
                      <p className="font-semibold">
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price:</p>
                      <p className="text-blue-600 font-semibold">
                        ${event.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Venue:</p>
                      <p className="font-semibold">{event.venue}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Available Tickets:</p>
                      <p
                        className={`font-semibold ${
                          event.availableTickets < 100
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {event.availableTickets}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Select Tickets
                    </h2>
                    <p className="text-sm text-gray-500">
                      {event.availableTickets < 100
                        ? "Hurry! Limited tickets remaining"
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      onClick={() =>
                        setTicketCount(Math.max(1, ticketCount - 1))
                      }
                      disabled={ticketCount <= 1}
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">
                      {ticketCount}
                    </span>
                    <button
                      className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      onClick={() =>
                        setTicketCount(
                          Math.min(event.availableTickets, ticketCount + 1)
                        )
                      }
                      disabled={ticketCount >= event.availableTickets}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["firstName", "lastName", "email", "phone"].map((field) => (
                    <div key={field}>
                      <label className="block text-gray-700 mb-2">
                        {field.charAt(0).toUpperCase() +
                          field.slice(1).replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[field] ? "border-red-500" : ""
                        }`}
                      />
                      {errors[field] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sticky */}
            <div className="lg:w-[30%]">
              <div className="sticky top-24 space-y-4">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Tickets ({ticketCount}x)
                      </span>
                      <span>
                        ${calculateTotal(event, ticketCount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Venue</span>
                      <span>{event.venue}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Amount</span>
                        <span className="text-blue-600">
                          ${calculateTotal(event, ticketCount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {errors.submit && (
                  <div className="text-red-500 text-center mb-4">
                    {errors.submit}
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white py-4 px-8 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={calculateTotal(event, ticketCount).toFixed(2)}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
};

export default BookTickets;
