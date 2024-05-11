const db = require('../db');

class LenderInfo {
    constructor({ id, name, email, min_finance_score, min_lending_score, max_loan, interest_rate }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.min_finance_score = min_finance_score;
        this.min_lending_score = min_lending_score;
        this.max_loan = max_loan;
        this.interest_rate = interest_rate;
    }

    async getAllLendersData() {
        if (this.data) {
            return this.data;
        }
        try {
            const statement = 'SELECT * from LENDER_INFO';
            const values = [];
            const result = await db.query(statement, values);
            if (result.rows.length > 0) {
                this.data = result.rows;
                return this.data;
            }
            throw new Error("No Lender Details Not Found. Please upgrade to paid APIs.")

        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
}

module.exports = LenderInfo;