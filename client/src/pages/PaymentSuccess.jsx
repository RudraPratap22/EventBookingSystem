import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const { event, ticketCount, total, paymentId, isPending } = location.state || {};

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 pt-24 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600">Error</h1>
            <p className="text-gray-600 mt-2">No booking information found</p>
            <Link 
              to="/"
              className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Your payment has been processed successfully</p>
          {isPending && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-700">
                Your booking is pending admin approval. Once approved, it will appear in your My Bookings section.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="border-t pt-4">
            <h2 className="font-semibold mb-4">Order Details</h2>
            <p>Event: {event.title}</p>
            <p>Tickets: {ticketCount}</p>
            <p>Total Amount: ${total}</p>
            <p>Transaction ID: {paymentId}</p>
            <p className="mt-4 text-sm text-gray-500">
              Status: Pending Approval
            </p>
          </div>
        </div>

        <Link 
          to="/"
          className="mt-8 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;