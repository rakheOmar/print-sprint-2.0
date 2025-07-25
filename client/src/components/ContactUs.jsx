import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react'; // Lucide icons for visual appeal

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setMessageType('');

    // --- Replace this with your actual form submission logic ---
    // This is a placeholder for demonstration purposes.
    // In a real application, you'd send this data to a backend API (e.g., using fetch, axios)
    // or to a third-party form service (e.g., Formspree, Netlify Forms, EmailJS).

    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate success or failure
      const success = Math.random() > 0.1; // 90% chance of success for demo

      if (success) {
        setSubmitMessage('Your message has been sent successfully! We will get back to you soon.');
        setMessageType('success');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
      } else {
        throw new Error('Something went wrong. Please try again later.');
      }

    } catch (error) {
      setSubmitMessage(error.message || 'Failed to send message. Please check your network and try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
    // --- End of placeholder logic ---
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 opacity-10"
           style={{
             backgroundImage: "radial-gradient(at 50% 0%, hsl(210, 80%, 15%), transparent 70%), radial-gradient(at 0% 100%, hsl(240, 60%, 10%), transparent 70%)",
           }}
      ></div>

      <div className="relative z-10 bg-gray-900 p-10 rounded-2xl shadow-2xl max-w-5xl w-full border border-blue-700 animate-fade-in-up flex flex-col lg:flex-row gap-10">

        {/* Left Section: Contact Information */}
        <div className="lg:w-1/2 flex flex-col justify-between p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-inner">
          <h2 className="text-4xl font-bold text-white mb-8 text-center lg:text-left">Get in Touch</h2>
          <p className="text-gray-300 text-lg mb-8 text-center lg:text-left">
            Have questions, feedback, or need assistance? We're here to help!
            Reach out to us through any of the methods below.
          </p>

          <div className="space-y-6 flex-grow flex flex-col justify-center">
            <div className="flex items-center gap-4 text-gray-200 text-lg">
              <Mail className="w-7 h-7 text-blue-400 flex-shrink-0" />
              <a href="mailto:support@papersprint.com" className="hover:text-blue-300 transition-colors duration-200">
                support@papersprint.com
              </a>
            </div>
            <div className="flex items-center gap-4 text-gray-200 text-lg">
              <Phone className="w-7 h-7 text-blue-400 flex-shrink-0" />
              <a href="tel:+911234567890" className="hover:text-blue-300 transition-colors duration-200">
                +91 12345 67890 (Mon-Fri, 9 AM - 6 PM IST)
              </a>
            </div>
            <div className="flex items-start gap-4 text-gray-200 text-lg">
              <MapPin className="w-7 h-7 text-blue-400 flex-shrink-0 mt-1" />
              <span>
                Papersprint Headquarters,<br/>
                [Your Office Address Line 1],<br/>
                [Your Office Address Line 2],<br/>
                [Your City, State, Pin Code]
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-200 text-lg">
              <Clock className="w-7 h-7 text-blue-400 flex-shrink-0" />
              <span>
                Business Hours: Mon-Sat, 9:00 AM - 7:00 PM IST
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="lg:w-1/2 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-inner">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-sm font-semibold mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-semibold mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-300 text-sm font-semibold mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Inquiry about print order #12345"
                className="input input-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-sm font-semibold mb-2">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Type your message here..."
                className="textarea textarea-bordered w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 resize-y"
                required
              ></textarea>
            </div>
            {submitMessage && (
              <div className={`p-4 rounded-lg text-center ${messageType === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {submitMessage}
              </div>
            )}
            <button
              type="submit"
              className="btn bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 text-lg w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" /> Send Message
                </>
              )}
            </button>
          </form>
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
      `}</style>
    </div>
  );
};

export default ContactUs;