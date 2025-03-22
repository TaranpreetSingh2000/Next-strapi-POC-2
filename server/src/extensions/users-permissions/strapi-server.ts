import type { Core } from '@strapi/strapi';
import Auth from './controllers/auth';

export default (plugin: { strapi: Core.Strapi; controllers: any; routes: any }) => {
  console.log('Extending users-permissions plugin with custom auth controller');

  const authController = Auth({ strapi: plugin.strapi });
  plugin.controllers.auth = authController;

  console.log('Auth controller methods:', Object.keys(plugin.controllers.auth));

  // Replace all routes instead of filtering
  plugin.routes['content-api'] = {
    routes: [
      {
        method: 'POST',
        path: '/auth/local',
        handler: 'auth.login',
        config: { policies: [], auth: false },
      },
      {
        method: 'POST',
        path: '/auth/refresh',
        handler: 'auth.refresh',
        config: { policies: [], auth: false },
      },
      {
        method: 'POST',
        path: '/auth/local/register',
        handler: 'auth.register',
        config: { policies: [], auth: false },
      },
      {
        method: 'GET',
        path: '/auth/:provider/callback',
        handler: 'auth.callback',
        config: { policies: [], auth: false },
      },
      {
        method: 'POST',
        path: '/auth/forgot-password',
        handler: 'auth.forgotPassword',
        config: { policies: [], auth: false },
      },
      {
        method: 'POST',
        path: '/auth/reset-password',
        handler: 'auth.resetPassword',
        config: { policies: [], auth: false },
      },
      {
        method: 'GET',
        path: '/auth/email-confirmation',
        handler: 'auth.emailConfirmation',
        config: { policies: [], auth: false },
      },
      {
        method: 'POST',
        path: '/auth/send-email-confirmation',
        handler: 'auth.sendEmailConfirmation',
        config: { policies: [], auth: false },
      },
      {
        method: 'POST',
        path: '/auth/change-password',
        handler: 'auth.changePassword',
        config: { policies: [], auth: false },
      },
    ],
  };

  console.log('Custom routes registered:', plugin.routes['content-api'].routes.map((r) => `${r.method} ${r.path}`));
  return plugin;
};