import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handlePrintNowClick = () => {
    navigate('/print-section'); // Navigate to the '/print-section' route
  };

  return (
    <section className="relative flex items-center justify-center text-center min-h-[65vh] px-4 py-16 bg-gradient-to-br from-sky-500 to-blue-900 text-white overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 z-0"></div>

      <div className="relative z-10 max-w-4xl w-full animate-fade-in-down">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-md">
          <span className="block font-light">Your Ideas,</span>
          <span className="block font-bold animate-pulse">Printed to Perfection.</span>
        </h1>
        <p className="text-lg md:text-xl font-light mb-6 max-w-2xl mx-auto">
          From concept to doorstep, we make high-quality printing effortless and accessible.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handlePrintNowClick} // Add onClick handler here
            className="bg-white text-blue-900 font-semibold px-6 py-3 text-base rounded-lg shadow-lg hover:bg-gray-100 hover:-translate-y-1 transform transition-all duration-200 ease-in-out"
          >
            Print Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;