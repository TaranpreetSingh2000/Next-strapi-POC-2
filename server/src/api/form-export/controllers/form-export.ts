const fs = require("fs");
const path = require("path");

module.exports = {
  async exportFormData(ctx) {
    try {
      // Fetch all form data from Strapi
      const entries = await strapi.entityService.findMany("api::faq-form.faq-form", {
        populate: "*", // Fetch all fields
        limit: 1000, // Adjust as needed
      });

      // Convert to JSON string
      const jsonData = JSON.stringify(entries, null, 2);

      // Save JSON file temporarily (optional)
      const filePath = path.join(__dirname, "form_dump.json");
      fs.writeFileSync(filePath, jsonData);

      // Set response headers for file download
      ctx.set("Content-Type", "application/json");
      ctx.set("Content-Disposition", `attachment; filename=form_dump.json`);

      // Send JSON data as response
      ctx.send(jsonData);
    } catch (error) {
      console.error("Export error:", error);
      ctx.throw(500, "Failed to export form data");
    }
  },
};
