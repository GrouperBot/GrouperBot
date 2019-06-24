const fs = require('fs');

class Database {
    /**
     * Stores the information used for advertisments
     */
    constructor() {
        this.file = 'adverts.json';
        this.data = null;
    }

    Initialize() {
        let self = this;
        fs.readFile(this.file, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    self.data = [];
                    return;
                }

                throw err;
            }
            self.data = JSON.parse(data);
        });
    }

    Save() {
        fs.writeFile(this.file, JSON.stringify(this.data), 'utf8', (err, data) => {
            if (err) {
                console.log('error writing database to file');
                console.log(err);
            }
        });
    }
}

module.exports = Database;