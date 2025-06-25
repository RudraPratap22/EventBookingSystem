const USD_TO_INR = 83; // Current approximate conversion rate

export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = async (amount, options = {}) => {
  try {
    // Convert USD to INR
    const amountInINR = Math.round(amount * USD_TO_INR);
    
    const paymentOptions = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: amountInINR * 100, // Convert to paise
      currency: "INR",
      name: "Event Booking",
      description: "Event Ticket Purchase",
      handler: function(response) {
        options.onSuccess?.(response);
        options.handlePaymentSuccess?.(response); // Use handlePaymentSuccess from options
      },
      prefill: options.prefill || {},
      theme: {
        color: "#3399cc"
      }
    };

    const razorpay = new window.Razorpay(paymentOptions);
    razorpay.open();
  } catch (error) {
    console.error('Payment initiation failed:', error);
    throw error;
  }
};