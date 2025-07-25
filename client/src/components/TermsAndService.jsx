import React from 'react';
import { Gavel, CheckSquare, XSquare, BookOpen, User, Lock, ExternalLink, Mail } from 'lucide-react';

const TermsAndService = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header Section */}
        <Gavel className="w-20 h-20 text-indigo-400 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Papersprint <span className="text-indigo-400">Terms of Service</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Please read these Terms of Service carefully before using the Papersprint website and services.
        </p>

        <div className="text-left space-y-12">

          {/* 1. Introduction */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-indigo-400 w-8 h-8" /> Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Welcome to Papersprint! These Terms of Service ("Terms") govern your use of the Papersprint website, located at 
              <a href="https://papersprint.com" className="text-indigo-400 hover:underline ml-1">https://papersprint.com</a>, 
              and any related services provided by Papersprint ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* 2. Accounts */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-100">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-indigo-400 w-8 h-8" /> Accounts
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed pl-4">
              <li>You are responsible for safeguarding the password you use to access the Service.</li>
              <li>You agree not to disclose your password to any third party.</li>
              <li>You must notify us immediately upon becoming aware of any unauthorized use of your account.</li>
              <li>You must be at least 18 years of age to use this Service.</li>
            </ul>
          </section>

          {/* 3. Orders and Payments */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <CheckSquare className="text-indigo-400 w-8 h-8" /> Orders and Payments
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>All orders are subject to acceptance and availability.</li>
              <li>We reserve the right to refuse or cancel any order at any time.</li>
              <li>You agree to provide accurate purchase and account information for all purchases.</li>
              <li>Payments are securely processed via trusted third-party gateways.</li>
              <li>Prices for services are subject to change without prior notice.</li>
            </ul>
          </section>

          {/* 4. User Content */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <XSquare className="text-indigo-400 w-8 h-8" /> User Content and Prohibited Uses
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              When you upload content, you confirm you have the necessary rights. You agree not to upload content that:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>Is unlawful, harmful, abusive, defamatory, obscene, or otherwise objectionable.</li>
              <li>Infringes on any intellectual property rights.</li>
              <li>Contains malicious software or code.</li>
              <li>Promotes illegal activities.</li>
            </ul>
            <p className="text-red-400 font-semibold mt-6">
              We reserve the right to remove content or terminate accounts violating these terms.
            </p>
          </section>

          {/* 5. Intellectual Property */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-indigo-400 w-8 h-8" /> Intellectual Property
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              The Service and its original content (excluding user content), features, and functionality remain the exclusive property of Papersprint and its licensors.
            </p>
          </section>

          {/* 6. Links */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-500">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <ExternalLink className="text-indigo-400 w-8 h-8" /> Links To Other Websites
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We are not responsible for third-party websites linked from our platform. We recommend reviewing their terms and policies before use.
            </p>
          </section>

          {/* 7. Contact Us */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-600">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="text-indigo-400 w-8 h-8" /> Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              If you have any questions about these Terms, contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed pl-4 mt-4">
              <li>Email: <a href="mailto:support@papersprint.com" className="text-indigo-400 hover:underline">support@papersprint.com</a></li>
              <li>Website: <a href="https://papersprint.com/contact-us" className="text-indigo-400 hover:underline">Contact Page</a></li>
            </ul>
          </section>

        </div>

        <p className="text-gray-500 text-sm mt-16">
          &copy; {currentYear} Papersprint. All Rights Reserved.
        </p>
      </div>

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
      `}</style>
    </div>
  );
};

export default TermsAndService;
