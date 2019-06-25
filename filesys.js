const fs = require('fs');

class Database {
    /**
     * Stores the information used for advertisments
     */
    constructor() {
        this.file = 'adverts.json';
        this.data = null
    }

    Open() {
        // Get JSON file
        try {
          this.data = require("./adverts.json")
        } catch(e) {
          if (e.code === 'ENOENT') {this.data = [];return;} // Return data as empty Array
          console.log(e)
        }
    }

    Close() {
        fs.writeFile(this.file, JSON.stringify(this.data), 'utf8', (err, data) => {
            if (err) {
                console.log('error writing database to file');
                console.log(err);
            }
        });
    }
}

module.exports = Database;
