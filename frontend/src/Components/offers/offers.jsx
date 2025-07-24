import React from "react";
import "./offers.css";
import offer1 from "../../Images/offer1.jpg";
import offer2 from "../../Images/offer2.jpg";
import offer3 from "../../Images/offer3.jpg";

const offers = [
  {
    discount: "Flat 10% off",
    code: "SUMMERSAVE10",
    description: "Flat 10% off on bookings between 1 to 3 days",
    image: offer1,
  },
  {
    discount: "Flat 15% off",
    code: "SUMMERSAVE15",
    description: "Flat 15% off on bookings between 3 to 5 days",
    image: offer2,
  },
  {
    discount: "Flat 20% off",
    code: "SUMMERSAVE20",
    description: "Flat 20% off on bookings above 5 days",
    image: offer3,
  },
];

const TrendingOffers = () => {
  return (
    <div className="trending-offers">
      <h2 className="heading">Trending Offers</h2>
      <div className="offers-container">
        {offers.map((offer, index) => (
          <div className="offer-card" key={index}>
            <img src={offer.image} alt="Offer" className="offer-image" />
            <div className="offer-details">
              <h3>{offer.discount}</h3>
              <p>
                <strong>Use Code: {offer.code}</strong>
              </p>
              <p>{offer.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingOffers;
