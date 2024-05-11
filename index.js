const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}


const PanInfo = require('./models/pan_info');

const signUpService = require('./services/signup_service');
const balanceSheetService = require('./services/balanceSheetService');


const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json());

console.log(swaggerSpec);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

/**
 * @swagger
 * /healthcheck:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns a success message indicating that the system is healthy
 *     responses:
 *       200:
 *         description: Success message
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
app.get('/healthcheck', (req, res) => {
    console.log("System is healthy");
    res.status(200).send('System is running');
});


app.get('/getCreditScore', async (req, res, next) => {
    try {
        const { pan } = req.query;
        const panInfo = await (new PanInfo({ pan })).getDataByPan();
        const { LatePayments, CreditScore } = panInfo.data;
        res.status(200).send({ LatePayments, CreditScore });
    } catch (err) {
        next(err);
    }
});

app.post('/signUp', async (req, res, next) => {
    try {
        const data = await signUpService.signUp(req.body);
        res.send(data);
        return user;
    } catch (err) {
        next(err);
    }
});

app.post('/balanceSheet', async (req, res, next) => {
    try {
        const data = await balanceSheetService.process(req.body);
        res.send(data);
    } catch (err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json(err.message);
});

const PORT = process.env.PORT | 5000;
app.listen(PORT, function () {
    console.log(`Express App running at http://127.0.0.1:${PORT}/`);
});

module.exports = app;