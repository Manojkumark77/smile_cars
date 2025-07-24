import React from "react";
import "./home.css";
import carImage from "../../Images/car.png";

const Home = () => {
  return (
    <div className="home">
      <div className="home-text">
        <h3>Self Driving Cars Rentals in Chennai</h3>
        <h1>
          Limited offers of up to <br />
          <span className="highlight">
            30% For <span className="red-text">Booking Over 5 Days!!</span>
          </span>
        </h1>
        <p>Book a car from the best car rental in Chennai company</p>
        <button type="button" className="call-btn">
          &#9743; +91 7339375459
        </button>
      </div>
      <div className="home-image">
        <img src={carImage} alt="Promo Car" />
      </div>
    </div>
  );
};

export default Home;
