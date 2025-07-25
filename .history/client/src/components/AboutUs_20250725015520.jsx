import React from 'react';
import { FaStore, FaUsers, FaDollarSign } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Empowering Local Growth: About <span className="text-violet-400">Paper</span><span className="text-white">sprint.</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          At Papersprint, we're building a network of thriving local businesses. Join us to transform ambition into measurable success, one sprint at a time.
        </p>

        {/* Section 1 */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold">What is the Papersprint Partner Program?</h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto text-lg">
            Become a cornerstone of your community. Launch your own Papersprint store and lead the charge in a new era of local business growth and innovation.
          </p>
        </div>

        {/* Section 2: Benefits */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold">How Our Partnership Fuels Your Success</h2>
          <p className="mt-4 text-gray-400 text-lg">Discover the pillars of our shared success journey:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {/* Card 1 */}
            <div className="bg-[#1a1c26] p-6 rounded-xl shadow hover:shadow-violet-500/30 transition-all duration-300">
              <FaStore className="text-violet-400 text-4xl mb-4" /> {/* Slightly larger icon */}
              <h3 className="text-xl font-semibold mb-2">Effortless Store Launch</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We guide you from finding the ideal location to a swift, seamless opening. Leverage our expert support and proven blueprint for rapid setup and sustained operation.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1a1c26] p-6 rounded-xl shadow hover:shadow-violet-500/30 transition-all duration-300">
              <FaUsers className="text-violet-400 text-4xl mb-4" /> {/* Slightly larger icon */}
              <h3 className="text-xl font-semibold mb-2">Cultivate a Winning Team</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Attract and empower local talent. Our comprehensive, easy-to-follow training modules ensure your team is proficient, motivated, and ready to deliver excellence.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1a1c26] p-6 rounded-xl shadow hover:shadow-violet-500/30 transition-all duration-300">
              <FaDollarSign className="text-violet-400 text-4xl mb-4" /> {/* Slightly larger icon */}
              <h3 className="text-xl font-semibold mb-2">Maximize Your Profit Potential</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Once operational, experience consistent growth and enjoy reliable monthly payouts. Your business will not only thrive financially but also make a real impact.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Call to action */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold">Ready to Gain a Competitive Edge?</h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
            Unlock powerful advantages, dedicated support, and a proven model for success as a Papersprint partner. Let's collaborate to build something truly extraordinary together.
          </p>
          {/* Optional: Add a call-to-action button here if this is a standalone "About Us" */}
          {/* <button className="mt-8 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300">
            Join Our Partner Program
          </button> */}
        </div>

      </div>
    </div>
  );
};

export default AboutUs;