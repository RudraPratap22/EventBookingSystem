import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import { BrowserRouter as Router } from 'react-router-dom';  // Import BrowserRouter
import { PayPalScriptProvider } from '@paypal/react-paypal-js'; // Import PayPalScriptProvider
import App from './App';
import reportWebVitals from './reportWebVitals';

const initialOptions = {
  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID, // Add your PayPal Client ID
  currency: "USD",
  intent: "capture",
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PayPalScriptProvider options={initialOptions}>
      <App />
    </PayPalScriptProvider>
  </React.StrictMode>
);

reportWebVitals();
