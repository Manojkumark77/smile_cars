import React from "react";
import { Link } from "react-router-dom";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import "./footer.css";
import logo from "../../Images/smilcars-logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logo} alt="Car Rental Logo" className="footer-logo" />
          <p>
            Rent a car for self-drive across India. Affordable pricing, flexible
            plans, and a wide range of vehicles.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/cars">Cars</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-contact">
          <div>
            <FaPhone /> 91-7339375459
          </div>
          <div>
            <FaWhatsapp /> 91-7339375459
          </div>
          <div>
            <FaEnvelope /> smilecars@gmail.com
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2025 All rights reserved.</div>
        <div className="footer-socials">
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaYoutube />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
