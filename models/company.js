const db = require('../db');

class Company {
    constructor({ id, age, size, type, company_name, user_id, pan, annual_revenue, annual_profit, credit_score, late_payments, loan_amount, loan_tenure, month_wise_deposits, month_wise_withdrawal, financial_health_score }) {
        // initialise all these variables
        this.id = id;
        this.name = company_name;
        this.user_id = user_id;
        this.age = age;
        this.size = size;
        this.type = type;
        this.pan = pan;
        this.annual_revenue = annual_revenue;
        this.annual_profit = annual_profit;
        this.credit_score = credit_score;
        this.late_payments = late_payments;
        this.loan_amount = loan_amount;
        this.loan_tenure = loan_tenure;
        this.month_wise_deposits = month_wise_deposits;
        this.month_wise_withdrawal = month_wise_withdrawal;
        this.financial_health_score = financial_health_score && Math.floor(financial_health_score);
    }

    async save() {
        console.log(this.id);
        if (this.id) {
            return this.update();
        }
        return this.create();
    }

    async update() {
        try {
            // add COALESCE for all fields
            const statement = 'UPDATE company_info SET name=COALESCE(name, $1), user_id=COALESCE($2, user_id), pan=COALESCE($3, pan), annual_revenue=COALESCE($4, annual_revenue), annual_profit=COALESCE($5, annual_profit), credit_score=COALESCE($6, credit_score), late_payments=COALESCE($7, late_payments), loan_amount=COALESCE($8, loan_amount), loan_tenure=COALESCE($9, loan_tenure), financial_health_score=COALESCE($10, financial_health_score), month_wise_deposits=COALESCE($11, month_wise_deposits), month_wise_withdrawal=COALESCE($12, month_wise_withdrawal) WHERE id=$13';
            const values = [this.name, this.user_id, this.pan, this.annual_revenue, this.annual_profit, this.credit_score, this.late_payments, this.loan_amount, this.loan_tenure, this.financial_health_score, this.month_wise_deposits, this.month_wise_withdrawal, this.id];
            const result = await db.update(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("Unable to update company");
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    async create() {
        try {
            // update all the fields into company table
            const statement = 'INSERT INTO company_info(name, user_id, pan, annual_revenue, annual_profit, credit_score, late_payments, loan_amount, loan_tenure, financial_health_score, month_wise_deposits, month_wise_withdrawal, age, size, type) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)';
            const values = [this.name, this.user_id, this.pan, this.annual_revenue, this.annual_profit, this.credit_score, this.late_payments, this.loan_amount, this.loan_tenure, this.financial_health_score, this.month_wise_deposits, this.month_wise_withdrawal, this.age, this.size, this.type];
            console.log(statement, values);
            const result = await db.update(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("Unable to create company");
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    async getCompanyIdFromUserId() {
        try {
            const statement = 'SELECT id FROM company_info WHERE user_id=$1';
            const values = [this.user_id];
            const result = await db.query(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("Company not found");
        } catch (err) {
            throw new Error(err);
        }
    }

    async getCompanyDataFromUserId() {
        try {
            const statement = 'SELECT * FROM company_info WHERE user_id=$1';
            const values = [this.user_id];
            const result = await db.query(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("Company not found");
        } catch (err) {
            throw new Error(err);
        }
    }

}

module.exports = Company;