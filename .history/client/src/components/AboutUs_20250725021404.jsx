import React from 'react';
import { Printer, FastForward, ShieldCheck } from 'lucide-react'; // Using Lucide icons for a more modern feel, matching DocumentSubmit.jsx

const AboutUs = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 flex items-center justify-center">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Welcome to <span className="text-violet-400">Paper</span><span className="text-white">sprint.</span>
        </h1>
        <p className="text-gray-400 mt-4 text-xl max-w-3xl mx-auto font-light">
          Your ultimate destination for lightning-fast, high-quality, and secure printing services.
          We bridge the gap between your digital documents and tangible prints, effortlessly.
        </p>

        {/* Section 1: What We Are */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Papersprint is designed for individuals and businesses who demand efficiency and reliability.
            We've built a seamless platform that simplifies your printing needs, from a single document to large-scale projects.
          </p>
        </div>

        {/* Section 2: Why Choose Us (Benefits) */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Papersprint?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 text-left">
            {/* Card 1: Speed */}
            <div className="bg-[#1a1c26] p-8 rounded-xl shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-2">
              <FastForward className="text-violet-400 text-5xl mb-6 mx-auto md:mx-0" />
              <h3 className="text-2xl font-semibold mb-3">Lightning-Fast Service</h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Gone are the days of waiting. Upload your documents in seconds and get them ready for pickup or delivery with unparalleled speed.
              </p>
            </div>

            {/* Card 2: Quality */}
            <div className="bg-[#1a1c26] p-8 rounded-xl shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-2">
              <Printer className="text-violet-400 text-5xl mb-6 mx-auto md:mx-0" />
              <h3 className="text-2xl font-semibold mb-3">Premium Print Quality</h3>
              <p className="text-gray-400 text-base leading-relaxed">
                We use state-of-the-art printing technology to ensure every page, color, and detail is crisp, vibrant, and professional.
              </p>
            </div>

            {/* Card 3: Security */}
            <div className="bg-[#1a1c26] p-8 rounded-xl shadow-lg hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-2">
              <ShieldCheck className="text-violet-400 text-5xl mb-6 mx-auto md:mx-0" />
              <h3 className="text-2xl font-semibold mb-3">Secure & Confidential</h3>
              <p className="text-gray-400 text-base leading-relaxed">
                Your privacy is paramount. We guarantee the utmost security for your uploaded files and personal information.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Our Promise */}
        <div className="mt-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Promise to You</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
            At Papersprint, we're committed to making printing simple, accessible, and worry-free.
            Experience the future of printing – efficient, reliable, and always at your fingertips.
          </p>
          {/* Optional Call to Action */}
          {/* <button className="mt-10 bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 text-lg tracking-wide">
            Get Started with Papersprint Today
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default AboutUs;