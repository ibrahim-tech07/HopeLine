import React, { useState, useEffect } from "react";
import API from "../api/api";
import Cookies from "js-cookie";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import PendingAppointments from "../components/PendingAppointments";
import { ToastContainer } from "react-toastify";
import Loading from "../components/Loading";
const Appoinment = () => {
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const userRole = Cookies.get("role");
  const userEmail = Cookies.get("email");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userEmail || userRole === "USER") {
      navigate("/403");
    }
  }, [userEmail, navigate]);

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
          <PendingAppointments />
          <Footer />
        </>
      )}
    </>
  );
};

export default Appoinment;
