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
  const router = useRouter();
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("refreshToken")
  );
  const [tokenExpiryTime, setTokenExpiryTime] = useState(() =>
    localStorage.getItem("tokenExpiryTime")
  );
  const [homepageData, setHomepageData] = useState(null);

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const result = await useFetch(GET_HOMEPAGE_DATA);
        setHomepageData(_.get(result, "data.homepage", {}));
      } catch (err) {
        console.log("Error fetching homepage data:", err);
      }
    };
    fetchHomepageData();
  }, []);

  useEffect(() => {
    let intervalId = null;

    if (refreshToken) {
      console.log("Starting token check globally...");
      intervalId = setInterval(() => {
        console.log("Checking token expiry...");
        checkTokenExpiry();
      }, 5000);
    } else {
      console.log("No refresh token available, skipping interval setup");
    }

    return () => {
      if (intervalId) {
        console.log("Cleaning up interval...");
        clearInterval(intervalId);
      }
    };
  }, [refreshToken]);

  const checkTokenExpiry = async () => {
    const accessToken = Cookies.get("accessToken");
    const storedExpiryTime = localStorage.getItem("tokenExpiryTime");

    if (!accessToken || !storedExpiryTime) {
      console.log("No token or expiry time found");
      if (refreshToken) {
        console.log("Attempting to refresh...");
        await refreshAccessToken();
      }
      return;
    }

    const currentTime = Date.now();
    console.log(storedExpiryTime,'--> store', currentTime,'--> current')
    const timeLeft = parseInt(storedExpiryTime) - currentTime;
    const refreshThreshold = 10000;

    console.log(timeLeft,'-->')
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
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (!storedRefreshToken) {
      console.log("No refresh token found, redirecting to login...");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:1337/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      const data = await response.json();
      if (data.jwt && data.refreshToken) {
        console.log(
          "Token refreshed successfully",
          data.jwt,
          data.refreshToken
        );
        saveTokens(data.jwt, data.refreshToken);
      } else {
        console.log("Invalid refresh token, logging out...");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiryTime");
        setRefreshToken(null);
        setTokenExpiryTime(null);
        router.push("/login");
      }
    } catch (error) {
      console.log("Error refreshing token", error);
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiryTime");
      setRefreshToken(null);
      setTokenExpiryTime(null);
      router.push("/login");
    }
  };

  const saveTokens = (accessToken, newRefreshToken) => {
    const expiresIn = 60;
    const expiryTime = Date.now() + expiresIn * 1000;

    Cookies.set("accessToken", accessToken, { path: "/", expires: 1 / 1440 });
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("tokenExpiryTime", expiryTime.toString());

    setRefreshToken(newRefreshToken);
    setTokenExpiryTime(expiryTime.toString());
    console.log("Tokens saved, expires at:", new Date(expiryTime));
  };

  const isAuthenticated = Cookies.get("accessToken");

  const handleLogout = () => {
    Cookies.remove("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiryTime");
    router.push("/login");
  };


  return (
    <ProtectedRoute>
      <div className="w-full h-full p-6 space-y-6 bg-gray-100 min-h-screen">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to the Homepage</h1>
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

        {/* FAQ Section */}
        <div className="rounded-lg shadow-lg overflow-hidden bg-white p-4">
          <FaqForm />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Homepage;
