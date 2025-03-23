"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { GET_HOMEPAGE_DATA } from "@/api/graphql/queries";
import BannerTeaser from "@/components/bannerTeaser/BannerTeaser";
import RevenueCards from "@/components/revenuecard/RevenueCards";
import _ from "lodash";
import useFetch from "@/hooks/useFetch";
import FaqForm from "@/components/faqform/FaqForm";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

const Homepage = () => {
  const storedRefreshToken = Cookies.get("refreshToken");
  const router = useRouter();
  const [homepageData, setHomepageData] = useState(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const { data } = await useFetch(GET_HOMEPAGE_DATA);
        console.log(data.homepage);
        setHomepageData(data.homepage);
      } catch (err) {
        console.log("Error fetching homepage data:", err);
      }
    };
    fetchHomepageData();
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log("Checking token expiry...");
  //     checkTokenExpiry();
  //   }, 5000);

  //   return () => {
  //     console.log("Cleaning up interval...");
  //     clearInterval(intervalId);
  //   };
  // }, [storedRefreshToken]);

  const checkTokenExpiry = async () => {
    const accessToken = Cookies.get("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    const storedExpiryTime = localStorage.getItem("tokenExpiryTime");

    if (!accessToken && !refreshToken) {
      console.log("No tokens found, redirecting to login...");
      router.push("/login");
      return;
    }

    if (!accessToken && refreshToken) {
      console.log("Access token expired, attempting to refresh...");
      await refreshAccessToken();
    }

    const currentTime = Date.now();
    console.log(storedExpiryTime, "--> store", currentTime, "--> current");
    const timeLeft = parseInt(storedExpiryTime) - currentTime;
    const refreshThreshold = 10000;

    console.log(timeLeft, "-->");
    console.log(`Time left: ${timeLeft / 1000}s`);

    if (timeLeft <= refreshThreshold && timeLeft > 0) {
      console.log(
        `Token nearing expiry (${timeLeft / 1000}s left). Refreshing...`
      );
      await refreshAccessToken();
    } else if (timeLeft <= 0) {
      console.log("Token has expired. Attempting refresh...");
      await refreshAccessToken();
    } else {
      console.log("Token still valid");
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      console.log("No refresh token found, redirecting to login...");
      router.push("/login");
      return;
    }

    debugger;
    try {
      const response = await fetch("http://localhost:1337/api/auth/refresh", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok && data.jwt) {
        localStorage.removeItem("tokenExpiryTime");
        console.log("Token refreshed successfully, new JWT:", data.jwt);
        saveTokens(data.jwt);
      } else {
        console.log("Refresh token expired or invalid, logging out...");
        handleLogout();
      }
    } catch (error) {
      console.log("Error refreshing token", error);
      handleLogout();
    }
  };

  const saveTokens = (accessToken) => {
    Cookies.set("accessToken", accessToken, {
      path: "/",
      expires: 1 / 1440,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    const expiryTime = Date.now() + 60 * 1000;
    localStorage.setItem("tokenExpiryTime", expiryTime.toString());
    console.log("New access token saved in cookie, expires in 1 min");
  };

  const isAuthenticated = Cookies.get("accessToken");

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:1337/api/auth/logout", {
        method: "POST",
      });
      const data = await response.json();
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      localStorage.removeItem("tokenExpiryTime");
      router.push("/login");
      alert(data.message);
    } catch (error) {
      console.log("Logout error:", error);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      router.push("/login");
    }
  };

  return (
    // <ProtectedRoute>
    <div className="w-full h-full p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome to the Homepage
        </h1>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}
      </div>

      {/* Banner Section */}
      <div className="rounded-lg shadow-lg overflow-hidden bg-white p-4">
        <BannerTeaser homedata={homepageData} overlayTeaser={true} />
      </div>
      <div className="rounded-lg shadow-lg overflow-hidden bg-white p-4">
        <RevenueCards revenuedata={homepageData?.Revenue} />
      </div>

      {/* FAQ Section */}
      <div className="rounded-lg shadow-lg overflow-hidden bg-white p-4">
        <FaqForm />
      </div>
    </div>
    // </ProtectedRoute>
  );
};

export default Homepage;
