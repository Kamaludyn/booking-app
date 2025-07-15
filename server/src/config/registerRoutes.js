const fs = require("fs");
const path = require("path");

// Function to dynamically register routes from each module
const registerRoutes = (app) => {
  // Define the path to the 'modules' directory
  const modulesDir = path.join(__dirname, "..", "modules");

  // Read each folder inside 'modules'
  fs.readdirSync(modulesDir).forEach((moduleName) => {
    // Construct the expected route file path for each module
    const routePath = path.join(
      modulesDir,
      moduleName,
      `${moduleName}.routes.js`
    );
    // Check if the route file exists
    if (fs.existsSync(routePath)) {
      try {
        // Require the router file
        const router = require(routePath);

        // Confirm the router is a valid Express router
        if (
          typeof router === "function" ||
          typeof router.router === "function"
        ) {
          // Mount the router on the API path
          app.use(`/api/v1/${moduleName}`, router);
          console.log(`Registered /api/v1/${moduleName}`);
        } else {
          console.error(`Invalid router in ${moduleName} module`);
        }
      } catch (error) {
        console.error(`Error loading routes for ${moduleName}:`, error.message);
      }
    }
  });
};

module.exports = registerRoutes;
