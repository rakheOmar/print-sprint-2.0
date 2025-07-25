import React from 'react';
import { Shield, Lock, Cookie, Mail, User, BookOpen } from 'lucide-react'; // Lucide icons for visual appeal

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header Section */}
        <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Papersprint <span className="text-blue-400">Privacy Policy</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Your trust is our priority. This policy explains how we collect, use, and protect your information.
        </p>

        {/* Policy Content Sections */}
        <div className="text-left space-y-12">

          {/* 1. Introduction */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-400 w-8 h-8" /> Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Welcome to Papersprint! We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our website and services. By accessing or using Papersprint, you agree to the terms of this policy.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-100">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-blue-400 w-8 h-8" /> Information We Collect
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              We collect different types of information to provide and improve our services to you:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li><strong className="text-white">Personal Information:</strong> Name, email, phone number, shipping address, and payment details.</li>
              <li><strong className="text-white">Document Data:</strong> Uploaded files for printing, temporarily stored securely until order completion.</li>
              <li><strong className="text-white">Usage Data:</strong> IP address, browser type, visited pages, and device info.</li>
              <li><strong className="text-white">Transaction Data:</strong> Order details and related payment information.</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-blue-400 w-8 h-8" /> How We Use Your Information
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              Papersprint uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>To provide and maintain our Service.</li>
              <li>To process orders and transactions.</li>
              <li>To manage accounts and provide customer support.</li>
              <li>To notify about service changes and offers.</li>
              <li>To monitor usage and improve services.</li>
              <li>To detect and prevent technical issues.</li>
            </ul>
          </section>

          {/* 4. Data Retention */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-blue-400 w-8 h-8" /> Data Retention
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Papersprint retains personal data only as long as necessary for services or legal compliance. Uploaded documents are deleted <span className="text-yellow-300">within 7 days of order completion</span> to ensure privacy.
            </p>
          </section>

          {/* 5. Disclosure of Data */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="text-blue-400 w-8 h-8" /> Disclosure of Data
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Your data may be disclosed to trusted partners or if legally required, but we never sell your personal information. Disclosures happen only to:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4 mt-4">
              <li>Comply with legal obligations.</li>
              <li>Protect and defend rights or property.</li>
              <li>Ensure service security and prevent fraud.</li>
            </ul>
          </section>

          {/* 6. Security of Data */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-500">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-blue-400 w-8 h-8" /> Security of Data
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              While no system is 100% secure, we use strong encryption and industry practices to protect your data from unauthorized access or disclosure.
            </p>
          </section>

          {/* 7. Data Protection Rights */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-600">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-blue-400 w-8 h-8" /> Your Data Protection Rights
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Depending on your location, you may have the right to access, correct, or delete your personal data, as well as withdraw consent. For requests, contact:
            </p>
            <p className="text-blue-400 mt-2">support@papersprint.com</p>
          </section>

          {/* 8. Cookies */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-700">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Cookie className="text-blue-400 w-8 h-8" /> Cookies
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We use cookies to track user activity and improve the experience. You can disable cookies in browser settings, but some features may not work properly.
            </p>
          </section>

          {/* 9. Links to Other Sites */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-800">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-400 w-8 h-8" /> Links to Other Sites
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Our site may link to third-party websites. We are not responsible for their privacy policies or content. Please review each site's privacy practices.
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-900">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-blue-400 w-8 h-8" /> Children's Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Our services are not directed to anyone under 18. We do not knowingly collect data from minors. Contact us if you believe we hold such information.
            </p>
          </section>

          {/* 11. Changes to Policy */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-1000">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-400 w-8 h-8" /> Changes to This Privacy Policy
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We may update this policy and notify users via email or site notices. Please review periodically for changes.
            </p>
          </section>

          {/* 12. Contact Us */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-1100">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="text-blue-400 w-8 h-8" /> Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed pl-4 mt-4">
              <li>Email: <a href="mailto:support@papersprint.com" className="text-blue-400 hover:underline">support@papersprint.com</a></li>
              <li>Contact Page: <a href="/contact-us" className="text-blue-400 hover:underline">Contact Us</a></li>
              <li>Phone: <span className="text-blue-400">+91-9876543210</span></li>
            </ul>
          </section>

        </div>

        {/* Footer for policy date */}
        <p className="text-gray-500 text-sm mt-16">
          <BookOpen className="inline-block w-4 h-4 mr-1 mb-0.5 text-gray-500" /> Last Updated: July 25, 2025
        </p>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1.0s; }
        .delay-1100 { animation-delay: 1.1s; }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;
