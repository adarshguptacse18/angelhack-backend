const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}


const PanInfo = require('./models/pan_info');
const User = require('./models/user');
const LenderInfo = require('./models/lender_info');

const signUpService = require('./services/signup_service');
const balanceSheetService = require('./services/balanceSheetService');
const Company = require('./models/company');


const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

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

app.get('/getCompanyData', async (req, res, next) => {
    try {
        const { user_id } = req.query;
        const companyData = await new Company({ user_id }).getCompanyDataFromUserId();
        res.status(200).send(companyData);
    } catch (err) {
        next(err);
    }
});

app.get('/getUserData', async (req, res, next) => {
    try {
        const { user_id } = req.query;
        const userData = await new User({ user_id }).getUserDataByUserId();
        res.status(200).send(userData);
    } catch (err) {
        next(err);
    }
});

app.post('/signUp', async (req, res, next) => {
    try {
        const data = await signUpService.signUp(req.body);
        // await balanceSheetService.process(req.body);
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

app.get('/getEligibleLenders', async (req, res, next) => {
    const { user_id, loan_amount, loan_tenure } = req.query;
    const companyData = await new Company({ user_id }).getCompanyDataFromUserId();
    let { credit_score, financial_health_score} = companyData;
    credit_score = parseInt(credit_score) / 10;
    financial_health_score = parseInt(financial_health_score || '80');  

    console.log({ financial_health_score, credit_score });
    const getAllLendersData = await new LenderInfo({}).getAllLendersData();
    const eligibleLenders = getAllLendersData.filter((lender) => {
        const result = lender.min_finance_score <= financial_health_score && lender.min_lending_score <= credit_score && lender.max_loan >= loan_amount && lender.max_tenure >= loan_tenure;
        console.log(lender, lender.min_finance_score <= financial_health_score, lender.min_lending_score <= credit_score, lender.max_loan >= loan_amount ,lender.max_tenure >= loan_tenure);
        return result;
        // console.log({lender, result});
    });
    res.status(200).send(eligibleLenders);
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