const Company = require('../models/company');

class BalanceSheetService {
    async process(args) {
        const allTransactions = args.transactions;
        const totalIncome = allTransactions.reduce((acc, curr) => {
            
            if (curr[" DEPOSIT AMT "]) {
                return acc + parseInt(curr[" DEPOSIT AMT "]);
            }
            return acc;
        }, 0);
        const {user_id, loan_tenure, loan_amount} = args;
        const company_id = await new Company({ user_id }).getCompanyIdFromUserId();
        return await new Company({ annual_revenue: totalIncome, loan_tenure, loan_amount, id: company_id.id }).save();
    }
}



module.exports = new BalanceSheetService();