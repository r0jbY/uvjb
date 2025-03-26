const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3001'
};

const outputFile = 'swagger-output.json';
const routes = ['../index.ts'];

swaggerAutogen(outputFile, routes, doc);