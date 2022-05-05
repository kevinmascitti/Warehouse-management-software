class DB {

    sqlite = require('sqlite3');

    constructor() {
        this.db = new this.sqlite.Database('ezwhDB.db', (err) => {
            if (err) throw err;
        });
    }

}

module.exports = DB;