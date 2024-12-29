import React, { useState, useEffect } from "react";
import Help from "../components/Help";
import Footer from "../components/Footer";
import API from "../api/api";
import Cookies from "js-cookie";
import Navbar from "../components/NavBar";
import Loading from "../components/Loading";

const HelpCenter = () => {
  const [user, setUser] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userEmail = Cookies.get("email");
    const userRole = Cookies.get("role");

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
          <Help />
          <Footer />
        </>
      )}
    </>
  );
};

export default HelpCenter;
