const db = require('../db');

class LoanApplication {
    constructor({ id, user_id, lender_id, loan_amount, loan_tenure, status, interest_rate }) {
        this.id = id;
        this.user_id = user_id;
        this.lender_id = lender_id;
        this.loan_amount = loan_amount;
        this.loan_tenure = loan_tenure;
        this.interest_rate = interest_rate;
        this.status = status;
    }

    async create() {
        try {
            // add all these fields into loan_application table
            const statement = 'INSERT INTO loan_application(user_id, lender_id, loan_amount, loan_tenure, status, interest_rate) VALUES($1, $2, $3, $4, $5, $6)';
            const values = [this.user_id, this.lender_id, this.loan_amount, this.loan_tenure, this.status || 'APPLIED', this.interest_rate];
            const result = await db.update(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("Unable to create user");
        } catch (err) {
            console.log("unable to create user");
            console.log(err);
            throw new Error(err);
        }
    }

    async getLoanStatusByUserIdAndLenderId() {
        try {
            const statement = 'SELECT * FROM loan_application WHERE user_id=$1 AND lender_id=$2';
            const values = [this.user_id, this.lender_id];
            const result = await db.query(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("User not found");
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateLoanStatus() {
        try {
            const statement = 'UPDATE loan_application SET status=$1 WHERE user_id=$2 AND lender_id=$3';
            const values = [this.status, this.user_id, this.lender_id];
            const result = await db.update(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
}

module.exports = LoanApplication;