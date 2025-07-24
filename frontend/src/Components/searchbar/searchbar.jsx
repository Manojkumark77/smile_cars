import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./searchbar.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SearchBar = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/cars")
      .then((res) => {
        const allBrands = [...new Set(res.data.cars.map((car) => car.brand))];
        setBrands(allBrands);
      })
      .catch((err) => console.error("Error fetching car brands:", err));
  }, []);

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

    navigate(`/cars?${params.toString()}`);
  };

  return (
    <>
      <section className="search-bar">
        <div className="search-item">
          <label htmlFor="brand-select">&#128663; Select Car Brand</label>
          <select
            id="brand-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="select">Select Car</option>
            {brands.map((brand, i) => (
              <option key={i} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="search-item">
          <label htmlFor="pickup-box">&#128197; Pickup Date</label>
          <input
            type="datetime-local"
            id="pickup-box"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="search-item">
          <label htmlFor="return-box">&#128197; Return Date</label>
          <input
            type="datetime-local"
            id="return-box"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={pickupDate || new Date().toISOString().slice(0, 16)}
          />
        </div>

        <button type="button" className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </section>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default SearchBar;
