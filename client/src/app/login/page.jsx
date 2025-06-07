"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    debugger;
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:1336/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      debugger

      const data = await response.json();
      if (response.ok && data.jwt && data.refreshToken) {
        saveTokens(data.jwt, data.refreshToken);
        console.log("Login successful, tokens stored in cookies");
        router.push("/");
        alert(data.message);
      } else {
        alert(data.message || "Invalid credentials, please try again.");
      }
    } catch (error) {
      console.log("An error occurred", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const saveTokens = (accessToken, refreshToken) => {
    const expiryTime = Date.now() + 60 * 1000;
    Cookies.set("accessToken", accessToken, {
      path: "/",
      expires: 1 / 1440,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    Cookies.set("refreshToken", refreshToken, {
      path: "/",
      expires: 2 / 1440,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    localStorage.setItem("tokenExpiryTime", expiryTime.toString());

    console.log(
      "Tokens saved in cookies, access expires in 1 min, refresh in 2 min"
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
