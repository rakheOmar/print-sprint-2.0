import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import PartnerReg from "./components/partnerreg.jsx";
import Navbar from "./components/Navbar.jsx";
import PartnerWithUsPage from "./components/PartnerWithUs.jsx";
import PrintingPage from "./components/DocumentSubmit.jsx";
import CartPage from "./components/Cart.jsx";
import HeroSection from "./components/Herosection.jsx";
import Card from "./components/Card.jsx";
import Footer from "./components/Footer.jsx";
import UserDashboard from "./components/OrderDashboard.jsx";
import CourierDashboard from "./components/CourierDashboard.jsx";
import ProfilePage from "./components/Profile.jsx";
import PaymentButton from "./components/PaymentButton.jsx";
import AboutUs from "./components/AboutUs.jsx";
import ContactUs from "./components/ContactUs.jsx";
import TermsAndService from "./components/TermsAndService.jsx";
import CareerPage from "./components/CareerPage.jsx";
import BlogPage from "./components/BlogPage.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import PartnerDashboard from "./components/PartnerDashboard.jsx";
import "./App.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center text-white bg-gray-900">
    <h1 className="text-6xl font-bold mb-4">404</h1>
    <p className="text-lg mb-6">Page not found</p>
    <a href="/" className="text-indigo-400 hover:underline">
      Go back home
    </a>
  </div>
);

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/careers" element={<CareerPage />} />
          <Route path="/terms-of-service" element={<TermsAndService />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/registerPartner" element={<PartnerReg />} />
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Card />
              </>
            }
          />
          <Route path="/print-section" element={<PrintingPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/partner-with-us" element={<PartnerWithUsPage />} />
          <Route path="/order-dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/payment" element={<PaymentButton amount={199} />} />
          <Route path="/courier-dashboard" element={<CourierDashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
