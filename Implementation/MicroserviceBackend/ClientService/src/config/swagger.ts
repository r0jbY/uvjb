import swaggerAutogen from 'swagger-autogen'

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3003'
};

const outputFile = 'swagger-output.json';
const routes = ['../app.ts'];

swaggerAutogen(outputFile, routes, doc);