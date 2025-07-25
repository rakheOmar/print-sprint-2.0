import React from 'react';
import { Rss, CalendarDays, Tag, ArrowRight } from 'lucide-react'; // Lucide icons for blog elements

// Placeholder data for blog posts (in a real app, this would come from an API/CMS)
const blogPosts = [
  {
    id: 1,
    title: "The Future of Fast Printing: What's Next for Papersprint?",
    excerpt: "Explore the innovations driving Papersprint forward, from AI-powered document processing to sustainable printing practices. Discover how we're shaping the future of on-demand printing.",
    date: "July 20, 2025",
    category: "Innovation",
    imageUrl: "https://images.unsplash.com/photo-1510519138101-570d1dca3d6b?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image
    link: "#" // Placeholder link to individual blog post
  },
  {
    id: 2,
    title: "Maximizing Efficiency: Tips for Bulk Document Printing",
    excerpt: "Learn professional tips and tricks to optimize your large-scale printing orders with Papersprint. From file preparation to choosing the right paper, we cover it all.",
    date: "July 15, 2025",
    category: "Tips & Tricks",
    imageUrl: "https://images.unsplash.com/photo-1522204523234-87295a756ce7?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image
    link: "#"
  },
  {
    id: 3,
    title: "Why Secure Printing Matters for Your Business",
    excerpt: "Understand the importance of document security in today's digital landscape. Papersprint's commitment to protecting your confidential information throughout the printing process.",
    date: "July 10, 2025",
    category: "Security",
    imageUrl: "https://images.unsplash.com/photo-1542831371-d6682701832d?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image
    link: "#"
  },
  {
    id: 4,
    title: "Eco-Friendly Printing: Papersprint's Green Initiatives",
    excerpt: "Discover how Papersprint is contributing to a sustainable future with eco-conscious printing solutions, recycled paper options, and responsible energy consumption.",
    date: "July 05, 2025",
    category: "Sustainability",
    imageUrl: "https://images.unsplash.com/photo-1534723821867-b5b974574971?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Example image
    link: "#"
  }
];

const BlogPage = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 font-sans">
      <div className="max-w-6xl mx-auto text-center">

        {/* Header Section */}
        <Rss className="w-20 h-20 text-orange-400 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Papersprint <span className="text-orange-400">Blog</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-16">
          Stay updated with the latest in printing technology, business tips, and Papersprint news.
        </p>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden flex flex-col transform hover:scale-[1.02] transition-all duration-300 animate-fade-in-up delay-${index * 100}`}
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold text-white mb-3 text-left">
                  {post.title}
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow text-left">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-gray-400 text-sm mt-auto pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>{post.category}</span>
                  </div>
                </div>
                <a
                  href={post.link}
                  className="mt-6 flex items-center justify-between text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
                >
                  Read More
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          ))}
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
        `}</style>
      </div>
    </div>
  );
};

export default BlogPage;