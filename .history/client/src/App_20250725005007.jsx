import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import PartnerWithUsPage from './components/PartnerWithUs.jsx';
import PrintingPage from './components/DocumentSubmit.jsx';
import CartPage from './components/Cart.jsx';
import HeroSection from './components/Herosection.jsx';
import Card from './components/Card.jsx';
import Footer from './components/Footer.jsx';
import UserDashboard from './components/OrderDashboard.jsx';
import CourierDashboard from './components/CourierDashboard.jsx';
import ProfilePage from './components/Profile.jsx';
import PaymentButton from './components/PaymentButton.jsx';
import AboutUs from './components/AboutUs.jsx';


import './App.css';

const App = () => {
  const location = useLocation();
  const noNavbarPaths = ['/signup'];
  const shouldShowNavbar = !noNavbarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<><HeroSection /><Card /></>} />
          <Route path="/print-section" element={<PrintingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
          <Route path="/order-dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<PaymentButton amount={199} />} />
          <Route path="/courier-dashboard" element={<><Navbar /><CourierDashboard /><Footer /></>} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
