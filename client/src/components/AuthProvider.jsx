"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [tokenExpiryTime, setTokenExpiryTime] = useState(() => localStorage.getItem("tokenExpiryTime"));

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
      } else {
        console.log("No refresh token, redirecting to login...");
        router.push("/login");
      }
      return;
    }

    const currentTime = Date.now();
    const timeLeft = parseInt(storedExpiryTime) - currentTime;
    const refreshThreshold = 10000;

    console.log(`Time left: ${timeLeft / 1000}s`);

    if (timeLeft <= refreshThreshold && timeLeft > 0) {
      console.log(`Token nearing expiry (${timeLeft / 1000}s left). Refreshing...`);
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
        console.log("Token refreshed successfully", data.jwt, data.refreshToken);
        saveTokens(data.jwt, data.refreshToken);
      } else {
        console.log("Invalid refresh token, logging out...");
        logoutUser();
      }
    } catch (error) {
      console.log("Error refreshing token", error);
      logoutUser();
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

  const logoutUser = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiryTime");
    Cookies.remove("accessToken");
    setRefreshToken(null);
    setTokenExpiryTime(null);
    router.push("/login");
  };

  return <>{children}</>;
}