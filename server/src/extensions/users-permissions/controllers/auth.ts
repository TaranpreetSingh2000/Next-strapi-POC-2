// src/users-permissions/controllers/auth.ts

import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

console.log("Custom auth controller loaded");

export default ({ strapi }) => ({
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    console.log("login called--->", identifier, password);

    const userEntities = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: { email: identifier },
      }
    );

    const user = userEntities[0];

    if (
      !user ||
      !(await strapi
        .plugin("users-permissions")
        .service("user")
        .validatePassword(password, user.password))
    ) {
      return ctx.badRequest("Invalid credentials");
    }

    const jwtService = strapi.plugin("users-permissions").service("jwt");
    const accessToken = jwtService.issue({ id: user.id }, { expiresIn: "1m" });
    const refreshToken = randomBytes(32).toString("hex");
    const refreshTokenExpiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await strapi.entityService.create("api::refresh-token.refresh-token", {
      data: {
        token: refreshToken,
        user: user.id,
        expiresAt: refreshTokenExpiry,
      },
    });

    ctx.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // Set to false for local dev (HTTP)
      maxAge: 1 * 60 * 1000, // 1 minute
      sameSite: "lax", // Allow cross-origin requests
      path: "/",
    });

    // Set both tokens in HTTP-only cookies
    ctx.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Set to false for local dev (HTTP)
      maxAge: 2 * 60 * 1000, // 2 minutes
      sameSite: "lax", // Allow cross-origin requests
      path: "/",
    });

    ctx.send({
      message: "Login successful",
      user,
      jwt: accessToken,
      refreshToken,
    });
  },

  async refresh(ctx: any) {
    const refreshToken = ctx.cookies.get("refreshToken");

    console.log("refresh called", refreshToken);

    if (!refreshToken) {
      return ctx.badRequest("Refresh token is required");
    }

    const tokenEntity = await strapi.entityService.findMany(
      "api::refresh-token.refresh-token",
      {
        filters: { token: refreshToken },
        populate: { user: true },
      }
    );

    if (
      !tokenEntity.length ||
      new Date(tokenEntity[0].expiresAt) < new Date()
    ) {
      // Clear cookies when refresh token is invalid or expired
      ctx.cookies.set("accessToken", null, { maxAge: 0 });
      ctx.cookies.set("refreshToken", null, { maxAge: 0 });
      return ctx.badRequest(
        "Refresh token invalid or expired. Please login again."
      );
    }

    const user = tokenEntity[0].user;
    const jwtService = strapi.plugin("users-permissions").service("jwt");
    const newAccessToken = jwtService.issue(
      { id: user.id },
      { expiresIn: "1m" }
    );

    // Only generate new access token, keep existing refresh token
    ctx.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false, // Set to false for local dev (HTTP)
      // secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 1000, // 1 minute
      // sameSite: 'strict',
      path: "/",
    });

    ctx.send({
      message: "Token refreshed",
      user,
      jwt: newAccessToken,
    });
  },

  async logout(ctx) {
    // Clear both cookies
    console.log(
      "logout called",
      ctx.cookies.get("accessToken"),
      ctx.cookies.get("refreshToken")
    );
    ctx.cookies.set("accessToken", null, { maxAge: 0 });
    ctx.cookies.set("refreshToken", null, { maxAge: 0 });

    // Optional: Delete refresh token from database
    const refreshToken = ctx.cookies.get("refreshToken");
    if (refreshToken) {
      const tokenEntity = await strapi.entityService.findMany(
        "api::refresh-token.refresh-token",
        {
          filters: { token: refreshToken },
        }
      );
      if (tokenEntity.length) {
        await strapi.entityService.delete(
          "api::refresh-token.refresh-token",
          tokenEntity[0].id
        );
      }
    }

    ctx.send({
      message: "Logged out successfully",
    });
  },

  async register(ctx: any) {
    const { email, username, password } = ctx.request.body;

    console.log("register called--->", email, username, password);

    const existingUser = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: { email },
      }
    );

    if (existingUser.length) {
      return ctx.badRequest(`User is already existed with ${email} `);
    }

    // Create new user
    const user = await strapi.plugin("users-permissions").service("user").add({
      email,
      username,
      password, 
      confirmed: true, // Set to false if you want email confirmation
      role: 1, // Default role (adjust as needed)
    });

    ctx.send({
      message: "Registration successful",
      user,
    });
  },

  async callback(ctx) {
    console.log("callback called");
    return ctx.badRequest(
      "Provider callback not implemented in custom controller"
    );
  },

  async forgotPassword(ctx) {
    console.log("forgotPassword called");
    return ctx.badRequest(
      "Forgot password not implemented in custom controller"
    );
  },

  async resetPassword(ctx) {
    console.log("resetPassword called");
    return ctx.badRequest(
      "Reset password not implemented in custom controller"
    );
  },

  async emailConfirmation(ctx) {
    console.log("emailConfirmation called");
    return ctx.badRequest(
      "Email confirmation not implemented in custom controller"
    );
  },

  async sendEmailConfirmation(ctx) {
    console.log("sendEmailConfirmation called");
    return ctx.badRequest(
      "Send email confirmation not implemented in custom controller"
    );
  },

  async changePassword(ctx) {
    console.log("changePassword called");
    return ctx.badRequest(
      "Change password not implemented in custom controller"
    );
  },

  async connect(ctx) {
    console.log("connect called");
    return ctx.badRequest("OAuth not implemented in custom controller");
  },
});
