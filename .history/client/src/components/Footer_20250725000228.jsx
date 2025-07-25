import emailjs from 'emailjs-com';
import { useRef, useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const form = useRef();
  const [success, setSuccess] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'YOUR_SERVICE_ID',     // from EmailJS dashboard
      'YOUR_TEMPLATE_ID',    // from EmailJS dashboard
      form.current,
      'YOUR_PUBLIC_KEY'      // from EmailJS dashboard
    ).then(
      (result) => {
        console.log(result.text);
        setSuccess(true);
        form.current.reset();
      },
      (error) => {
        console.error(error.text);
        setSuccess(false);
      }
    );
  };

  return (
    <footer className="bg-base-200 text-base-content">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* ... other footer sections ... */}

        {/* Newsletter */}
        <div>
          <h3 className="footer-title">Stay Connected</h3>
          <p className="text-sm mb-2">Subscribe to our newsletter</p>
          <form ref={form} onSubmit={sendEmail} className="form-control">
            <input type="email" name="user_email" placeholder="Email address" className="input input-bordered mb-2" required />
            <button type="submit" className="btn btn-primary w-full">Subscribe</button>
          </form>
          {success && <p className="text-green-400 text-sm mt-2">Thank you for subscribing!</p>}
          <div className="mt-4 text-sm">
            <p>Email: <a href="mailto:papersprint@gmail.com" className="link">papersprint@gmail.com</a></p>
            <p>Phone: <a href="tel:+918104912527" className="link">+91 8104912527</a></p>
            <p>123 Print St, Inkville, PR</p>
          </div>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="text-center text-xs py-4 border-t border-base-300">
        © {currentYear} PaperSprint. All rights reserved.
      </div>
    </footer>
  );
};
