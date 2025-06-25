import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignInSignUp = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (isSignUp) {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, {
          name,
          email,
          password,
        });
        console.log('User registered:', response.data);
        setIsSignUp(false);
      } else {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
          email,
          password,
        });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', response.data.user.name);
        localStorage.setItem('profilePicture', response.data.user.profilePicture || '/assets/images/defaultProfilePic.jpg');
        
        // Check for stored event data
        const prevPage = localStorage.getItem('prevPage');
        const storedEvent = localStorage.getItem('bookingEvent');
        
        if (prevPage && storedEvent) {
          const event = JSON.parse(storedEvent);
          localStorage.removeItem('prevPage');
          localStorage.removeItem('bookingEvent');
          navigate('/book-tickets', { state: { event } });
        } else {
          navigate(prevPage || '/');
        }
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        {!isSignUp && (
          <a
            href={`${process.env.REACT_APP_API_URL}/auth/google`}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all mb-6 text-center block"
          >
            Login with Google
          </a>
        )}

        {!isSignUp && (
          <div className="text-center text-sm mb-6">
            <span className="text-gray-600">Or continue with email</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 text-red-500 text-center bg-red-50 py-2 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-all"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage('');
            }}
            className="text-blue-600 hover:text-blue-700 transition-all"
          >
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInSignUp;