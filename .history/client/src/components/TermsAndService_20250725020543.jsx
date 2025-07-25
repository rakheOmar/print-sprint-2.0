import React from 'react';
import { Gavel, CheckSquare, XSquare, BookOpen, User, Lock, ExternalLink } from 'lucide-react'; // Lucide icons

const TermsAndService = () => {
  // Get current year for copyright notice
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header Section */}
        <Gavel className="w-20 h-20 text-indigo-400 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Papersprint <span className="text-indigo-400">Terms of Service</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Please read these Terms of Service carefully before using the Papersprint website and services.
        </p>

        {/* Policy Content Sections */}
        <div className="text-left space-y-12">

          {/* 1. Introduction */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-indigo-400 w-8 h-8" /> Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Welcome to Papersprint! These Terms of Service ("Terms") govern your use of the Papersprint website, located at <a href="[Your Website URL]" className="text-indigo-400 hover:underline">[Your Website URL]</a>, and any related services provided by Papersprint ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>
          </section>

          {/* 2. Accounts */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-100">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-indigo-400 w-8 h-8" /> Accounts
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed pl-4">
              <li>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</li>
              <li>You agree not to disclose your password to any third party.</li>
              <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
              <li>You must be at least 18 years of age to use this Service.</li>
            </ul>
          </section>

          {/* 3. Orders and Payments */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <CheckSquare className="text-indigo-400 w-8 h-8" /> Orders and Payments
            </h2>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>All orders placed through Papersprint are subject to acceptance and availability.</li>
              <li>We reserve the right to refuse or cancel your order at any time for certain reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order, or other reasons.</li>
              <li>You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Service.</li>
              <li>All payments are processed securely through our third-party payment gateways. We do not store your full payment card details on our servers.</li>
              <li>Prices for our services are subject to change without notice.</li>
            </ul>
          </section>

          {/* 4. Content (User Uploads) */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <XSquare className="text-indigo-400 w-8 h-8" /> User Content and Prohibited Uses
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              When you upload documents or other content ("Content") to Papersprint, you confirm that:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>You own the Content or have the necessary rights and permissions to use and authorize us to use it.</li>
              <li>The Content does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed text-base mt-4 mb-6">
              You agree not to use the Service for any unlawful purpose or to upload any Content that:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>Is unlawful, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable.</li>
              <li>Infringes on any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
              <li>Contains viruses, worms, or any other malicious code.</li>
              <li>Promotes illegal activities or provides instructional information about illegal activities.</li>
            </ul>
            <p className="text-red-400 font-semibold mt-6">
              Papersprint reserves the right to refuse service, remove or delete any Content, or terminate accounts that violate these terms, without prior notice.
            </p>
          </section>

          {/* 5. Intellectual Property */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-indigo-400 w-8 h-8" /> Intellectual Property
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Papersprint and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Papersprint.
            </p>
          </section>

          {/* 6. Links to Other Websites */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-500">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <ExternalLink className="text-indigo-400 w-8 h-8" /> Links To Other Websites
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Our Service may contain links to third-party websites or services that are not owned or controlled by Papersprint. Papersprint has no control over and assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that Papersprint shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such websites or services. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
            </p>
          </section>

          {/* 7. Termination */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-600">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <XSquare className="text-indigo-400 w-8 h-8" /> Termination
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-700">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Gavel className="text-indigo-400 w-8 h-8" /> Limitation of Liability
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              In no event shall Papersprint, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
            </p>
          </section>

          {/* 9. Governing Law */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-800">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Gavel className="text-indigo-400 w-8 h-8" /> Governing Law
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              These Terms shall be governed and construed in accordance with the laws of <span className="text-yellow-300">[Your Country/State/Jurisdiction, e.g., India, Maharashtra]</span>, without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-300 leading-relaxed text-base mt-4">
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
            </p>
          </section>

          {/* 10. Changes to These Terms */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-900">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-indigo-400 w-8 h-8" /> Changes to These Terms
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
            </p>
          </section>

          {/* 11. Contact Us */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-1000">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="text-indigo-400 w-8 h-8" /> Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed pl-4 mt-4">
              <li>By email: <a href="mailto:[Your Support Email]" className="text-indigo-400 hover:underline">[Your Support Email]</a></li>
              <li>By visiting this page on our website: <a href="[Your Contact Us Page URL]" className="text-indigo-400 hover:underline">[Your Contact Us Page URL]</a></li>
            </ul>
          </section>

        </div>

        {/* Footer for copyright notice */}
        <p className="text-gray-500 text-sm mt-16">
          &copy; {currentYear} Papersprint. All Rights Reserved.
        </p>
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

export default TermsAndService;