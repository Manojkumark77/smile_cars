import React from "react";
import "./AboutUs.css";
import aboutUsBannerImage from "../../Images/cars.jpg";

const AboutUs = () => {
  return (
    <>
      <div className="about-container">
        <div className="about-overlay">
          <h1 className="about-title">About Us</h1>
          <hr className="about-line" />
          <p className="about-description">
            High-Quality Customer Service & Seamless Rental Experience
          </p>
          <div className="about-buttons">
            <button type="button" className="about-btn">
              BOOK YOUR CAR
            </button>
            <button type="button" className="about-btn">
              +91 73393 75459
            </button>
          </div>
        </div>
      </div>

      <div className="about-info-section">
        <div className="info-container">
          <img
            src={aboutUsBannerImage}
            alt="About Smilecars"
            className="info-image"
          />
          <div className="info-text">
            <h2>
              GET TO KNOW <span className="highlight">ABOUT SMILECARS</span>
            </h2>
            <p>
              Welcome to SmileCars, your trusted partner in affordable and
              convenient self-driving car rentals in Chennai. Whether you're
              planning a weekend getaway, a business trip, or a city ride,
              SmileCars gives you the freedom to choose from a wide range of
              well-maintained, comfortable vehicles – all at competitive prices.
              <br></br>
              Our mission is to make car rental easy, flexible, and accessible
              for everyone. With a user-friendly online booking system,
              transparent pricing, and round-the-clock customer support,
              SmileCars ensures a seamless rental experience from booking to
              return.<br></br>
              At SmileCars, <strong> your journey is our priority </strong> –
              drive with confidence, comfort, and a smile
            </p>
            <button type="button" className="cta-button">
              BOOK YOUR FAVORITE CAR!!
            </button>
          </div>
        </div>

        <div className="stats-section">
          <h3 className="stats-title">Facts By The Numbers</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>1000+</h4>
              <p>Cars in Total</p>
            </div>
            <div className="stat-card">
              <h4>40+</h4>
              <p>Service Locations</p>
            </div>
            <div className="stat-card">
              <h4>10M+</h4>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <h4>15+</h4>
              <p>Years of Experience</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
