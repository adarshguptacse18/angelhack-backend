const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Newsletter service",
            version: "0.1.0",
            description:
                "This is a newsletter subscription service ",
            contact: {
                name: "Adarsh Gupta",
                url: "https://logrocket.com",
                email: "adarsh.gupta.22@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000",
            },
            {
                url: "http://ec2-54-206-23-94.ap-southeast-2.compute.amazonaws.com:5001"
            }
        ],
    },
    apis: ["*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;