import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react'; // Import a relevant icon from lucide-react

const HeroSection = () => {
  const navigate = useNavigate();

  const handlePrintNowClick = () => {
    navigate('/print-section');
  };

  return (
    <section className="relative flex items-center justify-center text-center min-h-[65vh] px-4 py-16 bg-gradient-to-br from-sky-600 to-blue-950 text-white overflow-hidden">
      {/* Background Overlay with Subtle Pattern (using pseudo-elements or an SVG/image) */}
      <div className="absolute inset-0 z-0 opacity-10 bg-repeat"
           style={{
             backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E\")",
             backgroundSize: '150px 150px', // Adjust size for desired density
           }}
      ></div>

      <div className="relative z-10 max-w-4xl w-full animate-fade-in-down">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight drop-shadow-lg"> {/* Increased font-size and weight */}
          <span className="block font-light text-blue-100">Your Ideas,</span> {/* Slightly lighter color for contrast */}
          <span className="block font-black text-white">Printed to Perfection.</span> {/* Stronger emphasis */}
        </h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto opacity-90"> {/* Increased margin-bottom, added opacity */}
          From concept to doorstep, we make high-quality printing effortless and accessible.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handlePrintNowClick}
            className="group relative bg-white text-blue-900 font-bold px-8 py-4 text-lg rounded-full shadow-xl hover:bg-gray-100 hover:-translate-y-1 transform transition-all duration-300 ease-in-out flex items-center justify-center gap-2 overflow-hidden" // Added 'group' for more complex hover
          >
            {/* Subtle background wave/fill on hover */}
            <span className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            <Printer className="w-5 h-5 text-blue-700 transition-transform duration-300 group-hover:rotate-12" /> {/* Icon with hover effect */}
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