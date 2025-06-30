import React from "react";
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { IoCallOutline, IoMailOutline, IoLocationOutline } from "react-icons/io5";
import { FiClock, FiShield, FiTruck, FiHeadphones } from "react-icons/fi";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-slate-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Shopify</h2>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your trusted online shopping destination for quality products at unbeatable prices.
                Shop with confidence and enjoy seamless delivery across India.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>

              <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <FaWhatsapp className="text-green-500 text-lg" />
                <span className="text-sm">WhatsApp: +91-9876543210</span>
              </div>

              <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <IoCallOutline className="text-blue-500 text-lg" />
                <span className="text-sm">Call Us: +91-9876543210</span>
              </div>

              <div className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <IoMailOutline className="text-red-500 text-lg" />
                <span className="text-sm">help@shopify.com</span>
              </div>

              <div className="flex items-center gap-3">
                <IoLocationOutline className="text-amber-500 text-lg" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* App Download */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Download Our App</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <img
                  src="appstore.svg"
                  alt="Download on App Store"
                  className="w-32 cursor-pointer hover:opacity-80 transition-opacity"
                />
                <img
                  src="playstore.svg"
                  alt="Get it on Google Play"
                  className="w-32 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
                { name: "Track Your Order", href: "/track" },
                { name: "Return Policy", href: "/returns" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
                { name: "FAQs", href: "/faq" },
                { name: "Careers", href: "/careers" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Popular Categories</h3>
            <ul className="space-y-3">
              {[
                "Electronics & Gadgets",
                "Fashion & Clothing",
                "Home & Kitchen",
                "Health & Beauty",
                "Sports & Fitness",
                "Books & Stationery",
                "Toys & Games",
                "Automotive",
              ].map((category) => (
                <li key={category}>
                  <Link
                    to="/products"
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Customer Service</h3>

            {/* Service Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FiTruck className="text-emerald-500" />
                <span className="text-sm">Free shipping on orders above ₹999</span>
              </div>

              <div className="flex items-center gap-3">
                <FiShield className="text-blue-500" />
                <span className="text-sm">100% Secure payments</span>
              </div>

              <div className="flex items-center gap-3">
                <FiClock className="text-amber-500" />
                <span className="text-sm">Easy 30-day returns</span>
              </div>

              <div className="flex items-center gap-3">
                <FiHeadphones className="text-purple-500" />
                <span className="text-sm">24/7 Customer support</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Follow Us</h4>
              <div className="flex gap-4">
                <FaFacebook className="text-xl cursor-pointer hover:text-blue-400 transition-colors" />
                <FaTwitter className="text-xl cursor-pointer hover:text-sky-400 transition-colors" />
                <FaInstagram className="text-xl cursor-pointer hover:text-pink-400 transition-colors" />
                <FaLinkedin className="text-xl cursor-pointer hover:text-blue-600 transition-colors" />
                <FaYoutube className="text-xl cursor-pointer hover:text-red-500 transition-colors" />
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Newsletter</h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-sm"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white font-medium transition-colors text-sm">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Get exclusive offers and updates directly to your inbox
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-slate-400">
              <p>© 2025 Shopify. All rights reserved.</p>
              <div className="flex gap-6">
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link to="/cookies" className="hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Powered by</span>
              <span className="text-white font-semibold">Shopify Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
