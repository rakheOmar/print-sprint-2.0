import React from 'react';
import { FaStore, FaUsers, FaDollarSign } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold">
          About <span className="text-violet-400">Paper</span><span className="text-white">sprint.</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Accelerate your business journey with us—where ambition turns into action and results.
        </p>

        {/* Section 1 */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">What is the Papersprint Partner Program?</h2>
          <p className="mt-2 text-gray-400 max-w-xl mx-auto">
            Become a local business hero: launch your own Papersprint store and join the new wave of growth!
          </p>
        </div>

        {/* Section 2: Benefits */}
        <div className="mt-20">
          <h2 className="text-2xl font-semibold">How our partnership empowers you</h2>
          <p className="mt-2 text-gray-400">Here’s how we build your success story together</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left">
            {/* Card 1 */}
            <div className="bg-[#1a1c26] p-6 rounded-xl shadow hover:shadow-violet-500/30 transition-all">
              <FaStore className="text-violet-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold">Get your store rolling</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Find the perfect location and launch quickly, with expert support each step of the way.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1a1c26] p-6 rounded-xl shadow hover:shadow-violet-500/30 transition-all">
              <FaUsers className="text-violet-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold">Build your dream team</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Recruit local talent and train them using our proven, easy-to-follow modules.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#1a1c26] p-6 rounded-xl shadow hover:shadow-violet-500/30 transition-all">
              <FaDollarSign className="text-violet-400 text-3xl mb-4" />
              <h3 className="text-xl font-semibold">Grow your earnings</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Once operations are set, enjoy steady monthly payouts as your business delivers real impact.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Call to action */}
        <div className="mt-24">
          <h2 className="text-2xl font-semibold">What do you gain?</h2>
          <p className="text-gray-400 mt-2 max-w-xl mx-auto">
            Unlock powerful advantages as a Papersprint partner. Let's build something extraordinary—together.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
