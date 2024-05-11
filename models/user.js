const db = require('../db');

class User {
    constructor({  user_id, name, email, phone}) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    async create() {
        try {
            // add all these fields into users table
            const statement = 'INSERT INTO user_info(user_id, name, email, phone) VALUES($1, $2, $3, $4)';
            const values = [this.user_id, this.name, this.email, this.phone];
            const result = await db.update(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("Unable to create user");
        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }

    async getUserDataByUserId() {
        try {
            const statement = 'SELECT * FROM user_info WHERE user_id=$1';
            const values = [this.user_id];
            const result = await db.query(statement, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            throw new Error("User not found");
        } catch (err) {
            throw new Error(err);
        }
    }

}

module.exports = User;