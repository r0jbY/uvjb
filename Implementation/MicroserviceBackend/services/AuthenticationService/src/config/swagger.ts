// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";
// import { Express } from "express";
// import path from "path"; // Import path module

// const options: swaggerJsdoc.Options = {
//   definition: {
//     openapi: "3.1.0",
//     info: {
//       title: "Auth Service API",
//       version: "1.0.0",
//       description: "API documentation for the authentication service",
//     },
//     servers: [{ url: "http://localhost:3001" }],
//   },
//   // ✅ FIX: Use `path.join(__dirname, "..")` to resolve correctly
//   apis: [path.join(__dirname, "../routes/*.ts")],
// };

// const swaggerSpec = swaggerJsdoc(options);

// export function setupSwagger(app: Express) {
//   app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
//   app.get("/api-docs.json", (req, res) =>{ res.json(swaggerSpec)});
// }


const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3001'
};

const outputFile = '../utils/swagger-output.json';
const routes = ['../index.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);