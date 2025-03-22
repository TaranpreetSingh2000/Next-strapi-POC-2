module.exports = ({ env }) => ({
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '5m', // Access token expires in 5 minutes
        },
      },
    },
  });