"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }) {
  const storedRefreshToken = Cookies.get("refreshToken");
  const router = useRouter();

  useEffect(() => {
    const intervalId = null;
    if (storedRefreshToken) {
      intervalId = setInterval(() => {
        console.log("Checking token expiry...");
        checkTokenExpiry();
      }, 5000);
    }

    return () => {
      console.log("Cleaning up interval...");
      clearInterval(intervalId);
    };
  }, [storedRefreshToken]);

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

  return <>{children}</>;
}
