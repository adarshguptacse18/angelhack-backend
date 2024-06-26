const User = require('../models/user');
const Company = require('../models/company');
const PanInfo = require('../models/pan_info');

class SignUpService {
    async signUp(args) {
        const panInfo = await new PanInfo({pan: args.pan}).getDataByPan();
        args.credit_score = panInfo.data.CreditScore;
        args.late_payments = panInfo.data.LatePayments;
        const company = await new Company(args).save();
        const user = await new User(args).create();

        return {user, company};
    }
}

module.exports = new SignUpService();