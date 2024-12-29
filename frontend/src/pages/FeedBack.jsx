import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import FeedbackForm from "../components/FeedbackForm";
import Footer from "../components/Footer";
import Cookies from "js-cookie";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading";

const FeedBack = () => {
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const userEmail = Cookies.get("email");
  const userRole = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "THERAPIST") {
      navigate("/403");
    }
  }, [userRole]);

  useEffect(() => {
    if (userEmail && userRole) {
      setRole(userRole);
      setIsLoggedIn(true);

      const fetchUserDetails = async () => {
        try {
          const response =
            userRole === "USER"
              ? await API.get(`/user/${userEmail}`)
              : await API.get(`/therapist/${userEmail}`);

          if (response.status === 200) {
            setUser(response.data.name);
            setAvatar(response.data.profilePicture || "");
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        userName={user}
        avatar={avatar}
        role={role}
      />
      {loading ? (
        <Loading />
      ) : (
        <>
          <ToastContainer />
          <FeedbackForm />
          <Footer />
        </>
      )}
    </>
  );
};

export default FeedBack;
