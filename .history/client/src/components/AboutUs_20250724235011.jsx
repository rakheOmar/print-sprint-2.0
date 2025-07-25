import { FaStore, FaUsers, FaDollarSign } from 'react-icons/fa';

function AboutUs() {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold">
          Paper<span className="text-violet-400">sprint.</span> <span className="text-white">partners</span>
        </h1>
        <p className="text-lg mt-4 text-gray-300">
          Accelerate your business journey with us—where ambition turns into action and results.
        </p>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">What is the Papersprint Partner Program?</h2>
          <p className="mt-2 text-gray-400">
            Become a local business hero: launch your own Papersprint store and join the new wave of growth!
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">How our partnership empowers you</h2>
          <p className="text-gray-400 mt-2">Here’s how we build your success story together</p>

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="bg-[#1a1c26] p-6 rounded-lg shadow hover:shadow-lg transition">
              <FaStore className="text-violet-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-lg font-semibold">Get your store rolling</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Find the perfect location and launch quickly, with expert support each step of the way.
              </p>
            </div>

            <div className="bg-[#1a1c26] p-6 rounded-lg shadow hover:shadow-lg transition">
              <FaUsers className="text-violet-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-lg font-semibold">Build your dream team</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Recruit local talent and train them using our proven, easy-to-follow modules.
              </p>
            </div>

            <div className="bg-[#1a1c26] p-6 rounded-lg shadow hover:shadow-lg transition">
              <FaDollarSign className="text-violet-400 text-3xl mb-4 mx-auto" />
              <h3 className="text-lg font-semibold">Grow your earnings</h3>
              <p className="text-gray-400 mt-2 text-sm">
                Once operations are set, enjoy steady monthly payouts as your business delivers real impact.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold">What do you gain?</h2>
          <p className="text-gray-400 mt-2">Unlock powerful advantages as a Papersprint partner</p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
