const db = require('../db');

class PanInfo {
    constructor({pan, data}) {
        this.pan = pan;
        this.data = data;
    }

    async getDataByPan() {
        if(this.data) {
            return this.data;
        }
        try {
            const statement = 'SELECT * from \"PAN_INFO\" WHERE pan = $1';
            const values = [this.pan];
            const result = await db.query(statement, values);
            if (result.rows.length > 0) {
                this.data = result.rows[0];
                return this.data;
            }
            throw new Error("PAN CARD Details Not Found. Please upgrade to paid APIs.")

        } catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
}

module.exports = PanInfo;