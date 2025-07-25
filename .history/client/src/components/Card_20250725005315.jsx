import React from 'react';
import { Award, Zap, LifeBuoy } from 'lucide-react'; // Importing icons from lucide-react

const printSprintServices = [
  {
    id: 1,
    // Using Lucide Icon component directly instead of image URL
    icon: Award,
    title: 'Uncompromising Quality',
    description:
      'We deliver sharp, vibrant, and professional prints every time, using premium materials and advanced technology.',
  },
  {
    id: 2,
    icon: Zap, // Lightning icon
    title: 'Lightning-Fast Turnaround',
    description:
      'Get your documents printed and delivered efficiently, helping you meet tight deadlines with ease.',
  },
  {
    id: 4,
    icon: LifeBuoy, // Support icon
    title: 'Dedicated Customer Support',
    description:
      'Our friendly experts are always ready to assist you, ensuring a smooth and hassle-free printing experience.',
  },
];

function Card() {
  return (
    <section className="py-20 px-6 bg-gray-900 text-gray-100" id="about-us-section"> {/* Darker background, more padding */}
      <div className="text-center mb-16 max-w-4xl mx-auto"> {/* Increased bottom margin, wider max-width */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-blue-400"> {/* Larger, bolder, accent color */}
          About PaperSprint.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed"> {/* Larger, softer color, better line-height */}
          Your trusted partner for all your printing needs. We combine cutting-edge technology with
          a commitment to excellence to deliver outstanding results, every single time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"> {/* Adjusted grid for 3 columns on large, added max-width */}
        {printSprintServices.map((service) => {
          const IconComponent = service.icon; // Get the Lucide icon component
          return (
            <div
              key={service.id}
              className="group card bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" // More pronounced hover
            >
              <figure className="px-8 pt-8 flex justify-center"> {/* Adjusted padding */}
                <div className="bg-blue-600 p-4 rounded-full inline-flex items-center justify-center shadow-lg group-hover:bg-blue-500 transition-colors duration-300"> {/* Circular background for icon */}
                  <IconComponent className="w-12 h-12 text-white group-hover:scale-110 transition-transform duration-300" /> {/* Larger icon, hover scale */}
                </div>
              </figure>
              <div className="card-body items-center text-center p-6"> {/* Adjusted padding */}
                <h3 className="card-title text-2xl font-bold text-white mb-2">{service.title}</h3> {/* Larger, bolder title */}
                <p className="text-gray-300 text-base leading-normal">{service.description}</p> {/* Clearer description text */}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Card;