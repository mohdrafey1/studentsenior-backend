const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger Definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Student Senior API',
        version: '1.0.0',
        description: 'API documentation for Student Senior platform',
    },
    servers: [
        {
            url: 'https://panel.studentsenior.com',
            description: 'Production server',
        },
        {
            url: 'http://localhost:8080',
            description: 'Local server',
        },
        {
            url: 'https://staging-studentsenior-backend.vercel.app',
            description: 'Staging Server',
        },
    ],
    components: {
        securitySchemes: {
            ApiKeyAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'x-api-key',
            },
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            College: {
                type: 'object',
                properties: {
                    name: { type: 'string', description: 'College name' },
                    location: {
                        type: 'string',
                        description: 'College location',
                    },
                    description: {
                        type: 'string',
                        description: 'College Description',
                    },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
