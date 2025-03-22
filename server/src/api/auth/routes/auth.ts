export default {
  routes: [
    {
      method: 'POST',
      path: '/auth/login',
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
      path: '/auth/register',
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