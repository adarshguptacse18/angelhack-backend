const { all } = require('..');
const Company = require('../models/company');

class BalanceSheetService {
    async process(args) {
        const allTransactions = args.transactions;
        const { monthlyDeposits, monthlyWithdrawals } = analyzeTransactions(allTransactions);
        console.log({ l: allTransactions.length });
        const totalIncome = allTransactions.reduce((acc, curr) => {
            if (curr["DEPOSIT AMT"]) {
                return acc + parseInt(curr["DEPOSIT AMT"]);
            }
            return acc;
        }, 0);
        const { user_id, loan_tenure, loan_amount } = args;
        console.log({ totalIncome, user_id, loan_tenure, loan_amount });
        const company_id = await new Company({ user_id }).getCompanyIdFromUserId();
        console.log({ totalIncome, user_id, loan_tenure, loan_amount });
        let cibil_score = 800;
        try {
            const { score: financial_health_score } = await fetch(
                `http://13.201.198.195:5000/predict?data={"income_annum": ${totalIncome}, "loan_amount": ${loan_amount}, "loan_term": ${loan_tenure}, "cibil_score": ${cibil_score}}&model_path=/home/ubuntu/Downloads/hackbanglore/reg_model.pkl`
            ).then(res => res.json());
            return await new Company({ annual_revenue: totalIncome, loan_tenure, loan_amount, id: company_id.id, month_wise_deposits: monthlyDeposits, month_wise_withdrawal: monthlyWithdrawals, financial_health_score }).save();
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
          }
}


function ExcelDateToJSDate(serial) {
    var utc_days = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = serial - Math.floor(serial) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

function analyzeTransactions(transactions) {

    if (!transactions) return;
    const monthlyDeposits = {};
    const monthlyWithdrawals = {};
    let allowedDates = [];
    console.log(transactions[0])
    for (const transaction of transactions) {
        const date = ExcelDateToJSDate(transaction.DATE);
        allowedDates.push([date.getFullYear(), date.getMonth()]);
    }
    const tmp = [];
    for (const date of allowedDates) {
        if (!tmp.find(d => d[0] === date[0] && d[1] === date[1])) {
            tmp.push(date);
        }
    }
    allowedDates = tmp;
    allowedDates = allowedDates.sort((b, a) => (a[0] * 12 + a[1]) - (b[0] * 12 + b[1]));
    allowedDates = allowedDates.slice(0, 12);
    console.log({ allowedDates });
    for (const transaction of transactions) {
        const month = ExcelDateToJSDate(transaction.DATE).getMonth() // Extract month
        const year = ExcelDateToJSDate(transaction.DATE).getFullYear() // Extract month
        const date = `${year}-${month}`;
        if (!(allowedDates.find(d => d[0] == year && d[1] == month))) continue;
        if (!monthlyDeposits[date]) {
            monthlyDeposits[date] = 0;
            monthlyWithdrawals[date] = 0;
        }

        monthlyDeposits[date] += transaction['DEPOSIT AMT'];
        monthlyWithdrawals[date] += transaction['WITHDRAWAL AMT'];
    }

    return { monthlyDeposits, monthlyWithdrawals };
}

module.exports = new BalanceSheetService();