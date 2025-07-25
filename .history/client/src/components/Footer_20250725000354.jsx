import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-base-200 text-base-content">
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Brand + Social */}
                <div>
                    <h2 className="text-2xl font-bold text-primary">PaperSprint.</h2>
                    <p className="mt-2 text-sm">Your ideas, printed to perfection.</p>
                    <div className="flex space-x-4 mt-4 text-lg">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <FaFacebookF />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>

                {/* Company Links */}
                <div>
                    <h3 className="footer-title">Company</h3>
                    <ul className="space-y-1">
                        <li><a className="link link-hover" href="/">Home</a></li>
                        <li><a className="link link-hover" href="/about-us">About Us</a></li>
                        <li><a className="link link-hover" href="/careers">Careers</a></li>
                        <li><a className="link link-hover" href="/blog">Blog</a></li>
                    </ul>
                </div>

                {/* Support Links */}
                <div>
                    <h3 className="footer-title">Support</h3>
                    <ul className="space-y-1">
                        <li><a className="link link-hover" href="/contact">Contact Us</a></li>
                        <li><a className="link link-hover" href="/privacy-policy">Privacy Policy</a></li>
                        <li><a className="link link-hover" href="/terms-of-service">Terms of Service</a></li>
                        <li><a className="link link-hover" href="/partner-with-us">Partner With Us</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="footer-title">Stay Connected</h3>
                    <p className="text-sm mb-2">Subscribe to our newsletter</p>
                    <form className="form-control">
                        <input type="email" placeholder="Email address" className="input input-bordered mb-2" />
                        <button className="btn btn-primary w-full">Subscribe</button>
                    </form>
                    <div className="mt-4 text-sm">
                        <p>Email: <a href="mailto:papersprint@gmail.com.com" className="link">papersprint@gmail.com</a></p>
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

export default Footer;
