import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
  Megaphone,
  Settings,
  FileText,
  Globe
} from 'lucide-react';

function PartnerWithUsPage() {
  const [activeFAQIndex, setActiveFAQIndex] = useState(null);
  const navigate = useNavigate();  // for navigation

  const handleRegisterClick = () => {
    navigate('/registerPartner');  // navigate to the registration page
  };

  const magicSteps = [
    {
      icon: <Briefcase className="w-10 h-10 text-primary" />,
      title: 'Get your store rolling',
      description: 'Find the perfect location and launch quickly, with expert support each step of the way.',
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: 'Build your dream team',
      description: 'Recruit local talent and train them using our proven, easy-to-follow modules.',
    },
    {
      icon: <DollarSign className="w-10 h-10 text-primary" />,
      title: 'Grow your earnings',
      description: 'Once operations are set, enjoy steady monthly payouts as your business delivers real impact.',
    },
  ];

  const benefitsList = [
    {
      icon: <TrendingUp className="w-10 h-10 text-primary" />,
      title: 'Rocket-fueled growth',
      description: 'Grow your business fast with a proven, scalable model tailored for results.',
    },
    {
      icon: <Megaphone className="w-10 h-10 text-primary" />,
      title: 'Boosted visibility',
      description: 'Tap into our wide reach and get your store noticed by thousands of eager customers.',
    },
    {
      icon: <Settings className="w-10 h-10 text-primary" />,
      title: 'Effortless management',
      description: 'Run your store smoothly with tried-and-tested processes and dedicated support.',
    },
    {
      icon: <FileText className="w-10 h-10 text-primary" />,
      title: 'Clear and honest earnings',
      description: 'Enjoy transparent accounting, so you always know where you stand.',
    },
    {
      icon: <Globe className="w-10 h-10 text-primary" />,
      title: 'Uplift your community',
      description: 'Provide important products and make a real difference in your neighborhood.',
    },
  ];

  const faqData = [
    {
      question: 'How will my store get orders?',
      answer:
        'All the demand is driven by the Print Sprint platform. Orders placed within your store’s catchment automatically appear on your dashboard.',
    },
    {
      question: 'What will be my core responsibilities?',
      answer:
        'You’ll be responsible for managing processes, including packing, billing, and handover to delivery partners.',
    },
    {
      question: 'Do I deliver the orders to customers?',
      answer:
        'No, your responsibility ends when you hand over orders to our delivery partners.',
    },
    {
      question: 'How soon can I break even in this business?',
      answer:
        'The ROI depends on your store’s efficiency and service. Our models help you reach profitability fast.',
    },
  ];

  const handleFAQClick = (index) => {
    setActiveFAQIndex(index === activeFAQIndex ? null : index);
  };

  return (
    <div className="px-6 md:px-16 space-y-20 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">
          Paper<span className="text-primary">sprint.</span> partners
        </h2>
        <p className="text-lg max-w-xl mx-auto">
          Accelerate your business journey with us—where ambition turns into action and results.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={handleRegisterClick}
        >
          Register Now
        </button>
      </div>

      {/* Intro */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold">What is the Papersprint Partner Program?</h3>
        <p>Become a local business hero: launch your own Papersprint store and join the new wave of growth!</p>
      </div>

      {/* Magic Steps */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-center">How our partnership empowers you</h3>
        <p className="text-center">Here’s how we build your success story together</p>
        <div className="grid md:grid-cols-3 gap-6">
          {magicSteps.map((step, index) => (
            <div key={index} className="card bg-base-100 shadow-md p-6 space-y-4 items-center text-center">
              <div>{step.icon}</div>
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-center">What do you gain?</h3>
        <p className="text-center">Unlock powerful advantages as a Papersprint partner</p>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {benefitsList.map((benefit, index) => (
            <div key={index} className="card bg-base-100 shadow-md p-4 space-y-3 items-center text-center">
              <div>{benefit.icon}</div>
              <h4 className="font-semibold">{benefit.title}</h4>
              <p className="text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6 text-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="join join-vertical w-full max-w-2xl mx-auto">
          {faqData.map((faq, i) => (
            <div key={i} className="collapse collapse-arrow join-item border border-base-200">
              <input type="checkbox" checked={activeFAQIndex === i} onChange={() => handleFAQClick(i)} />
              <div className="collapse-title text-lg font-medium">{faq.question}</div>
              <div className="collapse-content text-sm">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerWithUsPage;
