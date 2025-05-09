// backend/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Vaccination Portal API',
      version: '1.0.0',
      description: 'API documentation for the School Vaccination Portal',
    },
  },
  apis: ['./routes/*.js'], // Adjust this path if your routes are elsewhere
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
