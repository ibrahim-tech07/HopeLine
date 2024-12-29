import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../api/api";
import Navbar from "../components/NavBar";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading";

const Contact = () => {
  const email = Cookies.get("email");
  const role = Cookies.get("role");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) {
      setIsLoggedIn(true);
      fetchUserDetails();
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  }, [email]);

  const fetchUserDetails = async () => {
    try {
      const response = await API.get(`/user/${email}`);
      setUserData(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={userData?.name || ""}
        avatar={userData?.profilePicture || ""}
      />
      {loading && <Loading />}
      <ToastContainer />
      <ContactUs />
      <Footer />
    </>
  );
};

export default Contact;
