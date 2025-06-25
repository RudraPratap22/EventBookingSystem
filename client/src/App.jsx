import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import eventService from "./services/eventService";
import Layout from "./components/Layout";
import HeroSection from "./components/HeroSection";
import Categories from "./components/Categories";
import UpcomingEvents from "./components/UpcomingEvents";
import CatPage from "./pages/CatPage";
import BookingPage from "./pages/BookingPage";
import SignInSignUp from "./components/SignInSignUp";
import MyBookings from "./components/MyBookings";
import ScrollToTop from "./components/ScrollToTop";
import maleUserDefault from "./assets/images/male-user.png";
import BookTickets from "./components/BookTickets";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminLayout from "./components/Adminlayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents"
import AdminBookings from "./pages/AdminBookings";
import { BookingsProvider } from './context/BookingsContext';

const TokenHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const { name, profilePicture } = payload;

      localStorage.setItem("token", token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", name);
      localStorage.setItem("profilePicture", profilePicture || maleUserDefault);

      const prevPage = localStorage.getItem("prevPage") || "/";
      localStorage.removeItem("prevPage");
      navigate(prevPage, { replace: true });
    }
  }, [navigate]);

  return null;
};

const App = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      const eventsData = await eventService.fetchEvents();
      setEvents(eventsData);
    };
    loadEvents();
  }, []);

  const categories = [
    "Sports", "Technology", "Concert", "Conference", "Food & Drink",
  ];

  return (
    <BookingsProvider>
      <Router>
        <TokenHandler />
        <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <HeroSection events={events} categories={categories} />
                <Categories />
                <UpcomingEvents />
              </Layout>
            }
          />
          <Route 
            path="/category/:category" 
            element={
              <Layout>
                <CatPage events={events} />
              </Layout>
            } 
          />
          <Route 
            path="/booking/:eventTitle" 
            element={
              <Layout>
                <BookingPage events={events} />
              </Layout>
            } 
          />
          <Route 
            path="/book-tickets" 
            element={
              <Layout>
                <BookTickets events={events} setEvents={setEvents} />
              </Layout>
            } 
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminLayout>
                <AdminEvents />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminLayout>
                <AdminBookings />
              </AdminLayout>
            }
          />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<SignInSignUp />} />
        </Routes>
      </Router>
    </BookingsProvider>
  );
};

export default App;