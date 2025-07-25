import React from 'react';
import { Briefcase, Users, Lightbulb, Rocket, Award, HeartHandshake, MapPin, ExternalLink, Mail } from 'lucide-react';

const jobOpenings = [
  {
    id: 1,
    title: "Software Engineer (Frontend)",
    location: "Mumbai, India (Remote-friendly)",
    description: "Develop and maintain the user-facing features of the Papersprint platform, ensuring a seamless and intuitive user experience.",
    requirements: ["React.js", "Tailwind CSS", "JavaScript/TypeScript", "UI/UX principles"],
    link: "#apply-now"
  },
  {
    id: 2,
    title: "Operations Manager",
    location: "Mumbai, India",
    description: "Oversee daily printing operations, manage logistics, and ensure timely delivery of customer orders. Optimize workflows for efficiency.",
    requirements: ["Supply Chain Management", "Logistics coordination", "Team Leadership", "Problem-solving skills"],
    link: "#apply-now"
  },
  {
    id: 3,
    title: "Customer Support Specialist",
    location: "Remote (India)",
    description: "Provide exceptional support to Papersprint users, resolving inquiries and ensuring customer satisfaction through various channels.",
    requirements: ["Excellent communication skills", "Problem-solving attitude", "Experience with ticketing systems", "Customer-focused"],
    link: "#apply-now"
  },
  {
    id: 4,
    title: "Graphic Designer",
    location: "Mumbai, India",
    description: "Create compelling visual content for marketing, website, and in-app graphics. Ensure brand consistency across all platforms.",
    requirements: ["Adobe Creative Suite", "Figma", "Strong portfolio", "Understanding of branding"],
    link: "#apply-now"
  }
];

const CareerPage = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 font-sans">
      <div className="max-w-6xl mx-auto text-center">

        {/* Header Section */}
        <Briefcase className="w-20 h-20 text-teal-400 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Join the <span className="text-teal-400">Papersprint Team</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-16">
          Be part of a dynamic team that's redefining on-demand printing. We're looking for passionate individuals to grow with us.
        </p>

        {/* Why Join Us Section */}
        <div className="mt-16 text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Why Papersprint?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards (unchanged) */}
            
          </div>
        </div>

        {/* Current Openings Section */}
        <div className="mt-20 text-left" id="current-openings">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Current Openings</h2>
          <div className="space-y-8">
            {jobOpenings.map((job, index) => (
              <div
                key={job.id}
                className={`bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 transform hover:scale-[1.01] transition-all duration-300 animate-fade-in-up ${index === 0 ? "delay-500" : index === 1 ? "delay-600" : index === 2 ? "delay-700" : "delay-800"}`}
              >
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                  <p className="text-gray-400 mb-3 flex items-center gap-2 text-md">
                    <MapPin className="w-5 h-5 flex-shrink-0" /> {job.location}
                  </p>
                  <p className="text-gray-300 leading-relaxed text-base mb-4">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, reqIndex) => (
                      <span key={reqIndex} className="bg-gray-700 text-gray-200 text-xs px-3 py-1 rounded-full border border-gray-600">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:self-center mt-6 md:mt-0">
                  <a
                    href={job.link}
                    className="btn bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-teal-700 transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    Apply Now <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-700 text-center animate-fade-in-up delay-900">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make an Impact?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            We're always on the lookout for talented individuals to join our growing family. If you don't see a role that fits, feel free to send us your resume.
          </p>
          <a
            href="mailto:careers@papersprint.com"
            className="btn bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg tracking-wide flex items-center justify-center mx-auto max-w-sm"
          >
            <Mail className="w-6 h-6 mr-3" /> Send Your Resume
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
      `}</style>
    </div>
  );
};

export default CareerPage;
