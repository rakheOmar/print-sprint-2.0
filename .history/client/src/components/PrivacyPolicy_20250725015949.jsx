import React from 'react';
import { Shield, Lock, Cookie, Mail, User, BookOpen } from 'lucide-react'; // Lucide icons for visual appeal

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#0f111a] text-white min-h-screen px-6 py-20 font-sans">
      <div className="max-w-4xl mx-auto text-center">

        {/* Header Section */}
        <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
          Papersprint <span className="text-blue-400">Privacy Policy</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Your trust is our priority. This policy explains how we collect, use, and protect your information.
        </p>

        {/* Policy Content Sections */}
        <div className="text-left space-y-12">

          {/* 1. Introduction */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-400 w-8 h-8" /> Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Welcome to Papersprint! We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information when you use our website and services. By accessing or using Papersprint, you agree to the terms of this policy.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-100">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-blue-400 w-8 h-8" /> Information We Collect
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              We collect different types of information to provide and improve our services to you:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>
                <strong className="text-white">Personal Information:</strong> This includes information you directly provide to us, such as your name, email address, phone number, shipping address, and payment details when you create an account, place an order, or contact us.
              </li>
              <li>
                <strong className="text-white">Document Data:</strong> When you upload documents for printing, these files are temporarily stored on our secure servers. We process these files solely for the purpose of fulfilling your print order.
              </li>
              <li>
                <strong className="text-white">Usage Data:</strong> We automatically collect information on how the service is accessed and used. This "Usage Data" may include your computer's IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
              </li>
              <li>
                <strong className="text-white">Transaction Data:</strong> Details about the products and services you have purchased from us.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-200">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-blue-400 w-8 h-8" /> How We Use Your Information
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              Papersprint uses the collected data for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>To provide and maintain our Service.</li>
              <li>To process your print orders and transactions.</li>
              <li>To manage your account and provide customer support.</li>
              <li>To notify you about changes to our Service.</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so.</li>
              <li>To monitor the usage of our Service.</li>
              <li>To detect, prevent, and address technical issues.</li>
              <li>To provide you with news, special offers, and general information about other goods, services, and events which we offer that are similar to those that you have already purchased or enquired about, unless you have opted not to receive such information.</li>
            </ul>
          </section>

          {/* 4. Data Retention */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-300">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-blue-400 w-8 h-8" /> Data Retention
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Papersprint will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.
            </p>
            <p className="text-gray-300 leading-relaxed text-base mt-4">
              <strong className="text-white">Regarding Document Data:</strong> Uploaded documents are typically deleted from our servers within <span className="text-yellow-300">[e.g., 7 days, 30 days, upon order completion and successful delivery]</span> after your print order is fulfilled. This is done to ensure your privacy.
            </p>
          </section>

          {/* 5. Disclosure of Data */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-400">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="text-blue-400 w-8 h-8" /> Disclosure of Data
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
            </p>
            <p className="text-gray-300 leading-relaxed text-base mt-4">
              We may disclose your Personal Data in the good faith belief that such action is necessary to:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4 mt-4">
              <li>Comply with a legal obligation.</li>
              <li>Protect and defend the rights or property of Papersprint.</li>
              <li>Prevent or investigate possible wrongdoing in connection with the Service.</li>
              <li>Protect the personal safety of users of the Service or the public.</li>
              <li>Protect against legal liability.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed text-base mt-4">
              We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide you with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          {/* 6. Security of Data */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-500">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-blue-400 w-8 h-8" /> Security of Data
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.
            </p>
          </section>

          {/* 7. Your Data Protection Rights */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-600">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-blue-400 w-8 h-8" /> Your Data Protection Rights
            </h2>
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              Depending on your location, you may have the following data protection rights:
            </p>
            <ul className="list-disc list-inside space-y-3 text-gray-300 leading-relaxed pl-4">
              <li>The right to access, update or to delete the information we have on you.</li>
              <li>The right of rectification.</li>
              <li>The right to object.</li>
              <li>The right of restriction.</li>
              <li>The right to data portability.</li>
              <li>The right to withdraw consent.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed text-base mt-4">
              If you wish to exercise any of these rights, please contact us at <a href="mailto:[Your Support Email]" className="text-blue-400 hover:underline">[Your Support Email]</a>.
            </p>
          </section>

          {/* 8. Cookies and Tracking Technologies */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-700">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Cookie className="text-blue-400 w-8 h-8" /> Cookies
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Other tracking technologies are also used such as beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
            </p>
            <p className="text-gray-300 leading-relaxed text-base mt-4">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          {/* 9. Links to Other Sites */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-800">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-400 w-8 h-8" /> Links to Other Sites
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
            </p>
          </section>

          {/* 10. Children's Privacy */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-900">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <User className="text-blue-400 w-8 h-8" /> Children's Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
            </p>
          </section>

          {/* 11. Changes to This Privacy Policy */}
          <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-1000">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BookOpen className="text-blue-400 w-8 h-8" /> Changes to This Privacy Policy
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* 12. Contact Us */}
          {/* <section className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 animate-fade-in-up delay-1100">
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="text-blue-400 w-8 h-8" /> Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed text-base">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-300 leading-relaxed pl-4 mt-4">
              <li>By email: <a href="mailto:[Your Support Email]" className="text-blue-400 hover:underline">[Your Support Email]</a></li>
              <li>By visiting this page on our website: <a href="[Your Contact Us Page URL]" className="text-blue-400 hover:underline">[Your Contact Us Page URL]</a></li>
              <li>By phone number: <span className="text-blue-400">[Your Phone Number, optional]</span></li>
            </ul>
          </section> */}

        </div>

        {/* Footer for policy date */}
        <p className="text-gray-500 text-sm mt-16">
          <BookOpen className="inline-block w-4 h-4 mr-1 mb-0.5 text-gray-500" /> Last Updated: July 25, 2025
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
        .delay-1100 { animation-delay: 1.1s; }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;