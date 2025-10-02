const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'Contact API',
        description: 'API for managing contacts'
    },
    host: 'localhost:8000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/clients.js' ];

//this will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);