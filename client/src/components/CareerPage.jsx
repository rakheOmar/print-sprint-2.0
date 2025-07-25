import React from 'react';
import { Briefcase, Users, Lightbulb, Rocket, Award, HeartHandshake, MapPin, ExternalLink } from 'lucide-react'; // Lucide icons for visual appeal

// Placeholder data for job openings (in a real app, this would come from an API/CMS)
const jobOpenings = [
  {
    id: 1,
    title: "Software Engineer (Frontend)",
    location: "Mumbai, India (Remote-friendly)",
    description: "Develop and maintain the user-facing features of the Papersprint platform, ensuring a seamless and intuitive user experience.",
    requirements: ["React.js", "Tailwind CSS", "JavaScript/TypeScript", "UI/UX principles"],
    link: "#apply-now" // Placeholder link
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
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-start gap-4 animate-fade-in-up delay-0">
              <Users className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Collaborative Culture</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Work in a supportive environment where ideas are valued, and teamwork thrives. We believe in collective success.</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-start gap-4 animate-fade-in-up delay-100">
              <Lightbulb className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Innovation & Growth</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Be at the forefront of printing technology. We encourage continuous learning and provide opportunities for career advancement.</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-start gap-4 animate-fade-in-up delay-200">
              <Award className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Impactful Work</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Your contributions directly impact thousands of users. See your work make a tangible difference every day.</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-start gap-4 animate-fade-in-up delay-300">
              <HeartHandshake className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Employee Well-being</h3>
                <p className="text-gray-300 text-sm leading-relaxed">We care about our team. Enjoy competitive benefits, a healthy work-life balance, and a supportive community.</p>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 flex items-start gap-4 animate-fade-in-up delay-400">
              <Rocket className="w-8 h-8 text-teal-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Cutting-Edge Tech</h3>
                <p className="text-gray-300 text-sm leading-relaxed">Work with the latest tools and technologies in a fast-paced and evolving industry. Stay ahead of the curve.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Openings Section */}
        <div className="mt-20 text-left" id="current-openings">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Current Openings</h2>
          <div className="space-y-8">
            {jobOpenings.map((job, index) => (
              <div
                key={job.id}
                className={`bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 flex flex-col md:flex-row justify-between items-center md:items-start gap-6 transform hover:scale-[1.01] transition-all duration-300 animate-fade-in-up delay-${500 + index * 100}`}
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

        {/* Call to Action / How to Apply */}
        <div className="mt-24 bg-gray-900 p-10 rounded-2xl shadow-xl border border-gray-700 text-center animate-fade-in-up delay-900">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make an Impact?</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            We're always on the lookout for talented individuals to join our growing family. If you don't see a role that fits, feel free to send us your resume.
          </p>
          <a
            href="mailto:careers@papersprint.com" // Replace with your careers email
            className="btn bg-blue-600 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 text-lg tracking-wide flex items-center justify-center mx-auto max-w-sm"
          >
            <Mail className="w-6 h-6 mr-3" /> Send Your Resume
          </a>
        </div>

      </div>

      {/* Custom CSS for animations (can be moved to global CSS if preferred) */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1.0s; }
      `}</style>
    </div>
  );
};

export default CareerPage;