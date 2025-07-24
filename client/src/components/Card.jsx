import React from 'react';

const printSprintServices = [
  {
    id: 1,
    image: 'https://img.icons8.com/ios-filled/100/4a90e2/medal.png',
    title: 'Uncompromising Quality',
    description:
      'We deliver sharp, vibrant, and professional prints every time, using premium materials and advanced technology.',
  },
  {
    id: 2,
    image: 'https://img.icons8.com/ios-filled/100/2ecc71/speed.png',
    title: 'Lightning-Fast Turnaround',
    description:
      'Get your documents printed and delivered efficiently, helping you meet tight deadlines with ease.',
  },
  {
    id: 4,
    image: 'https://img.icons8.com/ios-filled/100/e74c3c/customer-support.png',
    title: 'Dedicated Customer Support',
    description:
      'Our friendly experts are always ready to assist you, ensuring a smooth and hassle-free printing experience.',
  },
];

function Card() {
  return (
    <section className="py-16 px-6 bg-base-100 text-base-content" id="about-us-section">
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">About PaperSprint</h1>
        <p className="text-lg">
          Your trusted partner for all your printing needs. We combine cutting-edge technology with
          a commitment to excellence to deliver outstanding results, every single time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {printSprintServices.map((service) => (
          <div
            key={service.id}
            className="card bg-base-200 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <figure className="px-10 pt-10">
              <img src={service.image} alt={`${service.title} icon`} className="w-20 h-20" />
            </figure>
            <div className="card-body items-center text-center">
              <h3 className="card-title text-xl font-semibold">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Card;
