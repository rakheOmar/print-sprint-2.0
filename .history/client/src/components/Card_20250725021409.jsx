// import React from 'react';

// const printSprintServices = [
//   {
//     id: 1,
//     image: 'https://img.icons8.com/ios-filled/100/4a90e2/medal.png',
//     title: 'Uncompromising Quality',
//     description:
//       'We deliver sharp, vibrant, and professional prints every time, using premium materials and advanced technology.',
//   },
//   {
//     id: 2,
//     image: 'https://img.icons8.com/ios-filled/100/2ecc71/speed.png',
//     title: 'Lightning-Fast Turnaround',
//     description:
//       'Get your documents printed and delivered efficiently, helping you meet tight deadlines with ease.',
//   },
//   {
//     id: 4,
//     image: 'https://img.icons8.com/ios-filled/100/e74c3c/customer-support.png',
//     title: 'Dedicated Customer Support',
//     description:
//       'Our friendly experts are always ready to assist you, ensuring a smooth and hassle-free printing experience.',
//   },
// ];

// function Card() {
//   return (
//     <section className="py-16 px-6 bg-base-100 text-base-content" id="about-us-section">
//       <div className="text-center mb-12 max-w-3xl mx-auto">
//         <h1 className="text-4xl font-bold mb-4">About PaperSprint.</h1>
//         <p className="text-lg">
//           Your trusted partner for all your printing needs. We combine cutting-edge technology with
//           a commitment to excellence to deliver outstanding results, every single time.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//         {printSprintServices.map((service) => (
//           <div
//             key={service.id}
//             className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-300"
//           >
//             <figure className="px-10 pt-10">
//               <img src={service.image} alt={`${service.title} icon`} className="w-20 h-20" />
//             </figure>
//             <div className="card-body items-center text-center">
//               <h3 className="card-title text-xl font-semibold">{service.title}</h3>
//               <p>{service.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default Card;

import React from 'react';
import { Award, Zap, LifeBuoy } from 'lucide-react'; // Modern icons

const printSprintServices = [
  {
    id: 1,
    icon: Award,
    title: 'Uncompromising Quality',
    description:
      'We deliver sharp, vibrant, and professional prints every time, using premium materials and advanced technology.',
  },
  {
    id: 2,
    icon: Zap,
    title: 'Lightning-Fast Turnaround',
    description:
      'Get your documents printed and delivered efficiently, helping you meet tight deadlines with ease.',
  },
  {
    id: 4,
    icon: LifeBuoy,
    title: 'Dedicated Customer Support',
    description:
      'Our friendly experts are always ready to assist you, ensuring a smooth and hassle-free printing experience.',
  },
];

function Card() {
  return (
    <section className="py-24 px-6 bg-gray-950 text-gray-100 font-sans border-t border-gray-800"> {/* Darker background, more padding, top border */}
      <div className="text-center mb-16 max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-tight text-white drop-shadow"> {/* Classic serif font for heading */}
          About PaperSprint.
        </h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Your trusted partner for all your printing needs. We combine cutting-edge technology with
          a commitment to excellence to deliver outstanding results, every single time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"> {/* Wider max-width, increased gap */}
        {printSprintServices.map((service) => {
          const IconComponent = service.icon;
          return (
            <div
              key={service.id}
              className="group card bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 hover:border-blue-500" // More rounded, subtle border, border on hover
            >
              <figure className="px-8 pt-10 flex justify-center">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-5 rounded-full inline-flex items-center justify-center shadow-lg group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-300"> {/* Gradient background for icon */}
                  <IconComponent className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-300" /> {/* Larger icon */}
                </div>
              </figure>
              <div className="card-body items-center text-center p-8"> {/* Increased padding */}
                <h3 className="card-title text-2xl font-semibold text-blue-300 mb-3">{service.title}</h3> {/* Accent color for title */}
                <p className="text-gray-300 text-base leading-relaxed">{service.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Card;