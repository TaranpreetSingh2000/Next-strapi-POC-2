module.exports = ({ env }) => ({
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '1m', // Access token expires in 5 minutes
        },
      },
    },
  });