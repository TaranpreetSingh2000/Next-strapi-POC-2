import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

console.log('Custom auth controller loaded');

export default ({ strapi }) => ({
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    console.log('login called--->', identifier, password);

    // Use entityService to find the user by email
    const userEntities = await strapi.entityService.findMany('plugin::users-permissions.user', {
      filters: { email: identifier },
    });

    const user = userEntities[0]; // Take the first match

    if (!user || !(await strapi.plugin('users-permissions').service('user').validatePassword(password, user.password))) {
      return ctx.badRequest('Invalid credentials');
    }

    const jwtService = strapi.plugin('users-permissions').service('jwt');
    const accessToken = jwtService.issue({ id: user.id }, { expiresIn: '5m' });

    const refreshToken = randomBytes(32).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await strapi.entityService.create('api::refresh-token.refresh-token', {
      data: {
        token: refreshToken,
        user: user.id,
        expiresAt: refreshTokenExpiry,
      },
    });

    ctx.send({
      jwt: accessToken,
      refreshToken,
      user,
    });
  },

  async refresh(ctx) {
    const { refreshToken } = ctx.request.body;

    console.log('refresh called', refreshToken);

    if (!refreshToken) {
      return ctx.badRequest('Refresh token is required');
    }

    const tokenEntity = await strapi.entityService.findMany('api::refresh-token.refresh-token', {
      filters: { token: refreshToken },
      populate: { user: true },
    });

    if (!tokenEntity.length || new Date(tokenEntity[0].expiresAt) < new Date()) {
      return ctx.badRequest('Invalid or expired refresh token');
    }

    const user = tokenEntity[0].user;

    const jwtService = strapi.plugin('users-permissions').service('jwt');
    const newAccessToken = jwtService.issue({ id: user.id }, { expiresIn: '5m' });

    const newRefreshToken = randomBytes(32).toString('hex');
    const newRefreshTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await strapi.entityService.delete('api::refresh-token.refresh-token', tokenEntity[0].id);

    await strapi.entityService.create('api::refresh-token.refresh-token', {
      data: {
        token: newRefreshToken,
        user: user.id,
        expiresAt: newRefreshTokenExpiry,
      },
    });

    ctx.send({
      jwt: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    });
  },

  async register(ctx) {
    console.log('register called');
    return ctx.badRequest('Registration not implemented in custom controller');
  },

  async callback(ctx) {
    console.log('callback called');
    return ctx.badRequest('Provider callback not implemented in custom controller');
  },

  async forgotPassword(ctx) {
    console.log('forgotPassword called');
    return ctx.badRequest('Forgot password not implemented in custom controller');
  },

  async resetPassword(ctx) {
    console.log('resetPassword called');
    return ctx.badRequest('Reset password not implemented in custom controller');
  },

  async emailConfirmation(ctx) {
    console.log('emailConfirmation called');
    return ctx.badRequest('Email confirmation not implemented in custom controller');
  },

  async sendEmailConfirmation(ctx) {
    console.log('sendEmailConfirmation called');
    return ctx.badRequest('Send email confirmation not implemented in custom controller');
  },

  async changePassword(ctx) {
    console.log('changePassword called');
    return ctx.badRequest('Change password not implemented in custom controller');
  },

  async connect(ctx) {
    console.log('connect called');
    return ctx.badRequest('OAuth not implemented in custom controller');
  },
});