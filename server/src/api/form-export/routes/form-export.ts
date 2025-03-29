module.exports = {
    routes: [
      {
        method: "GET",
        path: "/export-forms",
        handler: "form-export.exportFormData",
        config: {
          auth: false, // Set to true if authentication is required
        },
      },
    ],
  };
  