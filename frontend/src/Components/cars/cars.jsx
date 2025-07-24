import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./cars.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Fleet = ({ setShowLogin }) => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParam = (key) => {
    const params = new URLSearchParams(location.search);
    return params.get(key);
  };

  const fetchCars = (brand, pickup, ret) => {
    setLoading(true);

    const params = new URLSearchParams();
    if (brand && brand !== "All") {
      params.set("brand", brand);
    }
    if (pickup) {
      params.set("pickup_time", new Date(pickup).toISOString());
    }
    if (ret) {
      params.set("return_time", new Date(ret).toISOString());
    }

    const url = `http://localhost:8080/cars?${params.toString()}`;

    axios
      .get(url)
      .then((res) => {
        const allCars = res.data.cars;
        const brandOptions = res.data.brands || [];

        setCars(allCars);
        setBrands(["All", ...brandOptions]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch car data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const brand = getQueryParam("brand") || "All";
    const pickup = getQueryParam("pickup") || "";
    const ret = getQueryParam("return") || "";

    setSelectedBrand(brand);
    setPickupDate(pickup);
    setReturnDate(ret);

    fetchCars(brand, pickup, ret);
  }, [location.search]);

  const handleSearch = () => {
    if (!selectedBrand || selectedBrand === "select") {
      toast.warn("Please select a car brand.");
      return;
    }

    if (!pickupDate || !returnDate) {
      toast.warn("Please select both pickup and return dates.");
      return;
    }

    if (new Date(pickupDate) >= new Date(returnDate)) {
      toast.error("Return date must be after pickup date.");
      return;
    }

    const params = new URLSearchParams();
    params.set("brand", selectedBrand);
    params.set("pickup", pickupDate);
    params.set("return", returnDate);

    navigate(`?${params.toString()}`);
  };

  return (
    <div className="fleet-container">
      <h2>Pick Your Wheel</h2>

      <div className="filter-sections">
        <div className="search-items">
          <label htmlFor="brand-filter">🚗 Select Brand:</label>
          <select
            id="brand-filter"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Select Car</option>
            {brands.map((brand, i) => (
              <option key={i} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="search-items">
          <label htmlFor="pickup-date">📅 Pickup Date:</label>
          <input
            type="datetime-local"
            id="pickup-date"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="search-items">
          <label htmlFor="return-date">📅 Return Date:</label>
          <input
            type="datetime-local"
            id="return-date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={pickupDate || new Date().toISOString().slice(0, 16)}
          />
        </div>

        <button type="button" className="search-btns" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="fleet-cards">
        {cars.map((car, i) => (
          <div className="fleet-card" key={i}>
            <img src={car.image} alt={car.model} className="car-image" />
            <h3>{car.model}</h3>
            <p>{car.brand}</p>
            <p className="car-info">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⚡ {car.fuel}{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              👥 {car.seater} Seater
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ⚙️{" "}
              {car.transmission}
            </p>
            <p className="car-price">₹ {car.pricePerDay} / day</p>
            <div className="card-buttons">
              <button
                className="details-btn"
                onClick={() =>
                  navigate(`/details/${encodeURIComponent(car.model)}`)
                }
              >
                View Details
              </button>
              <button
                className="book-btn"
                onClick={() => {
                  const user = localStorage.getItem("user");
                  if (!user) {
                    setShowLogin(true);
                    return;
                  }
                  if (!pickupDate || !returnDate) {
                    toast.warn(
                      "Please select both pickup and return dates before booking."
                    );
                    return;
                  }
                  navigate("/bookings", {
                    state: {
                      carName: car.model,
                      id: car.id,
                      price: car.pricePerDay,
                      pickupDate,
                      returnDate,
                    },
                  });
                }}
              >
                Book my car
              </button>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Fleet;
