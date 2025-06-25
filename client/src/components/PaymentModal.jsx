import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { initiatePayment } from '../services/razorpay';
import { ReactComponent as RazorpayLogo } from '../assets/images/razorpay.svg';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess, onError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gray-50 p-4 border-b">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            Choose Payment Method
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Razorpay */}
          <div className="group">
            <button
              onClick={() => initiatePayment(amount, { onSuccess, onError })}
              className="w-full flex items-center justify-between p-4 border-2 rounded-lg hover:border-blue-500 transition-colors group-hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <RazorpayLogo className="w-24 h-8" />
                <p className="text-sm text-gray-500">UPI, Cards, Netbanking</p>
              </div>
              <span className="text-blue-600 font-medium">${amount}</span>
            </button>
          </div>

          {/* PayPal */}
          <div className="border-2 rounded-lg p-4">
            <div className="flex items-center gap-4 mb-3">
              <img 
                src="/assets/images/paypal-icon.png" 
                alt="PayPal" 
                className="h-8 w-auto object-contain"
              />
              <p className="text-sm text-gray-500">International payments</p>
            </div>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      currency_code: "USD",
                      value: amount.toString()
                    }
                  }]
                });
              }}
              onApprove={async (data, actions) => {
                const details = await actions.order.capture();
                onSuccess(details);
              }}
              onError={onError}
              style={{
                layout: 'horizontal',
                color: 'blue',
                shape: 'rect',
                label: 'paypal'
              }}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;