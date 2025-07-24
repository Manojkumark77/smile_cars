import React from "react";
import "./contact.css";
import { MapPin, PhoneCall, Mail } from "lucide-react";

const ContactUs = () => {
  return (
    <section className="contact-section">
      <h2 className="contact-subheading">REACH OUT ANYTIME</h2>
      <p className="contact-heading">
        YOUR JOURNEY BEGINS WITH A SIMPLE MESSAGE
      </p>
      <p className="contact-description">
        Tell us where you want to go, when you need a ride, and your ideal car.
        Our team will get in touch quickly to lock in the details and get you on
        the road smoothly.
      </p>

      <div className="contact-cards">
        <div className="contact-card">
          <MapPin className="contact-icon" />
          <h3>OUR LOCATION</h3>
          <p>
            4/123, OMR, Rajiv Gandhi Salai
            <br />
            Thoraipakkam, Chennai - 600 097
          </p>
        </div>
        <div className="contact-card">
          <PhoneCall className="contact-icon" />
          <h3>CALL US NOW</h3>
          <p>
            +91 7339375459
            <br />
            +91 8765487654
          </p>
        </div>
        <div className="contact-card">
          <Mail className="contact-icon" />
          <h3>DROP US A LINE</h3>
          <p>smileselfdrivecars@gmail.com</p>
        </div>
      </div>

      <div className="contact-form-wrapper">
        <h2 className="contact-booking">START BOOKING YOUR RIDE HERE</h2>
        <p className="contact-description">
          Fill out this quick form and we’ll be in touch shortly to confirm your
          car rental details.
        </p>
        <form className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="First Name *" required />
            <input type="text" placeholder="Last Name *" required />
          </div>
          <div className="form-row">
            <input type="email" placeholder="Email *" required />
            <input type="tel" placeholder="Phone *" required />
          </div>
          <textarea placeholder="Write Comment" rows="5"></textarea>
          <button type="submit" className="submit-button">
            SEND MESSAGE
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
