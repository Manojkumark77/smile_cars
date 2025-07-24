import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import Navbar from "./Components/navpage/navbar";
import Home from "./Components/homepage/home";
import SearchBar from "./Components/searchbar/searchbar";
import TrendingOffers from "./Components/offers/offers";
import AboutUs from "./Components/aboutUs/aboutus";
import Fleet from "./Components/cars/cars";
import CarDetails from "./Components/cars/cardetails";
import BookingForm from "./Components/bookings/bookings";
import Footer from "./Components/footer/footer";
import ContactUs from "./Components/contactus/contact";
import SignUpModal from "./Components/signup/signup";
import LoginModal from "./Components/login/login";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSwitchToLogin = () => {
    setShowSignUp(false);
    setShowLogin(true);
  };

  const handleSwitchToSignUp = () => {
    setShowLogin(false);
    setShowSignUp(true);
  };
  return (
    <Router>
      <Navbar setShowLogin={setShowLogin} setShowSignUp={setShowSignUp} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home /> <SearchBar /> <TrendingOffers /> <AboutUs />
              <Footer />
              {"  "}
            </>
          }
        ></Route>
        <Route path="/offers" element={<TrendingOffers />}></Route>
        <Route
          path="/aboutus"
          element={
            <>
              <AboutUs /> <Footer />
            </>
          }
        ></Route>
        <Route path="/cars" element={<Fleet setShowLogin={setShowLogin} />} />
        <Route path="/details/:model" element={<CarDetails />}></Route>
        <Route path="/bookings" element={<BookingForm />}></Route>
        <Route
          path="/contact"
          element={
            <>
              <ContactUs />
              <Footer />
            </>
          }
        ></Route>
        <Route
          path="*"
          element={
            <div
              style={{
                textAlign: "center",
                padding: "50px",
              }}
            >
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        ></Route>
      </Routes>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        switchToSignUp={handleSwitchToSignUp}
      />
      <SignUpModal
        isOpen={showSignUp}
        onClose={() => setShowSignUp(false)}
        switchToLogin={handleSwitchToLogin}
      />
    </Router>
  );
}
export default App;
