import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./bookings.css";
import car from "../../Images/car.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingForm = () => {
  const location = useLocation();
  const {
    carName = "",
    id = null,
    price = 0,
    pickupDate = "",
    returnDate = "",
  } = location.state || {};

  const user = JSON.parse(localStorage.getItem("user"));

  const [bookingData, setBookingData] = useState({
    contact: "",
    license: "",
    pickupDateTime: pickupDate,
    returnDateTime: returnDate,
    carName,
    carId: id,
  });

  const [errors, setErrors] = useState({});
  const [focus, setFocus] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const calculateAmount = () => {
    if (!bookingData.pickupDateTime || !bookingData.returnDateTime) return 0;
    const pickup = new Date(bookingData.pickupDateTime);
    const ret = new Date(bookingData.returnDateTime);
    const diffInMs = ret - pickup;
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays * price;
  };

  const amount = calculateAmount();

  const validate = () => {
    const FormFieldError = {};

    if (focus.contact && !/^\d{10}$/.test(bookingData.contact)) {
      FormFieldError.contact = "Contact must be exactly 10 digits";
    }

    if (focus.license && !/^[A-Za-z0-9]{11}$/.test(bookingData.license)) {
      FormFieldError.license = "License must be exactly 11 letters and numbers";
    }

    if (
      focus.returnDateTime &&
      bookingData.pickupDateTime &&
      bookingData.returnDateTime &&
      new Date(bookingData.returnDateTime) <=
        new Date(bookingData.pickupDateTime)
    ) {
      FormFieldError.returnDateTime =
        "Return date/time must be after pickup date/time";
    }

    setErrors(FormFieldError);

    const isValid =
      Object.keys(FormFieldError).length === 0 &&
      bookingData.contact &&
      bookingData.license &&
      bookingData.pickupDateTime &&
      bookingData.returnDateTime;

    setIsFormValid(isValid);
  };

  useEffect(() => {
    validate();
  }, [bookingData, focus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFocus((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const toISOString = (dateString) => {
    return new Date(dateString).toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.warn("Please fill all fields correctly before submitting.");
      return;
    }

    const payload = {
      carId: Number(bookingData.carId),
      userId: user?.id,
      name: user?.name,
      contact: bookingData.contact,
      license: bookingData.license,
      amount,
      pickupTime: toISOString(bookingData.pickupDateTime),
      returnTime: toISOString(bookingData.returnDateTime),
    };

    try {
      const response = await fetch("http://localhost:8080/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        if (
          response.status === 409 ||
          responseText.includes("already booked")
        ) {
          setBackendError(
            "This car is already booked during the selected period."
          );
          setBookingData((prev) => ({
            ...prev,
            pickupDateTime: "",
            returnDateTime: "",
          }));
        } else {
          setBackendError("Booking failed: " + responseText);
        }
        return;
      }

      toast.success("Booking submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting booking:", error.message);
    }
  };

  return (
    <>
      <div className="booking-wrapper">
        {!isSubmitted ? (
          <div className="booking-container">
            <div className="form-section">
              <h2>Rental Booking</h2>
              <form onSubmit={handleSubmit} noValidate>
                <input
                  type="text"
                  id="userName"
                  name="name"
                  placeholder="Your Name"
                  value={user?.name}
                  readOnly
                  required
                />

                <input
                  type="text"
                  name="contact"
                  placeholder="Contact Number"
                  value={bookingData.contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {focus.contact && errors.contact && (
                  <p className="error">{errors.contact}</p>
                )}

                <input
                  type="text"
                  name="license"
                  placeholder="License Number"
                  value={bookingData.license}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {focus.license && errors.license && (
                  <p className="error">{errors.license}</p>
                )}

                <div className="car-details-row">
                  <div className="input-group">
                    <label htmlFor="carName">Car Name</label>
                    <input
                      type="text"
                      id="carName"
                      name="carName"
                      placeholder="Car Name"
                      value={bookingData.carName}
                      readOnly
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="amount">Amount (₹)</label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={amount}
                      readOnly
                    />
                  </div>
                </div>

                <div className="datetime-row">
                  <div>
                    <label htmlFor="pickupDateTime">Pickup Date & Time</label>
                    <input
                      type="datetime-local"
                      name="pickupDateTime"
                      id="pickupDateTime"
                      value={bookingData.pickupDateTime}
                      readOnly
                    />
                  </div>
                </div>

                <div className="datetime-row">
                  <div>
                    <label htmlFor="returnDateTime">Return Date & Time</label>
                    <input
                      type="datetime-local"
                      name="returnDateTime"
                      id="returnDateTime"
                      value={bookingData.returnDateTime}
                      readOnly
                    />
                  </div>
                </div>

                <button type="submit" disabled={!isFormValid}>
                  BOOK NOW
                </button>
              </form>
            </div>
            <img src={car} alt="Cab" className="centered-car" />
            <div className="image-section"></div>
          </div>
        ) : (
          <div className="success-box">
            <h2>✅ Booking Confirmed</h2>
            <p>
              Thank you, {user?.name}! Your booking has been submitted
              successfully.
            </p>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default BookingForm;
