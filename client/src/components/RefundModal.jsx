import React from 'react';

const RefundModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Booking Cancelled Successfully</h2>
        <div className="space-y-4 mb-6">
          <p className="text-gray-600">
            Your booking has been cancelled successfully. The refund process has been initiated.
          </p>
          <p className="text-gray-600">
            Please note:
          </p>
          <ul className="list-disc list-inside text-gray-600 ml-4">
            <li>Refund will be processed to your original payment method</li>
            <li>It may take 5-7 business days to reflect in your account</li>
            <li>You will receive an email confirmation of the refund</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;