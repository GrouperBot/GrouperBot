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

    AddEntry(tag, obj) {
        if (!this.TagExists(tag)) {
            this.data[tag] = [];
        }

        this.data[tag].push(obj);
        this.Save();
    }

    TagExists(tag) {
        let t = tag.toLowerCase();
        return Object.keys(this.data).find(x => x == t) != null;
    }

    GetItems(tag) {
        if (!this.TagExists(tag)) {
            this.data[tag] = [];
        }

        this.CleanExpired(tag);
        return this.data[tag];
    }

    CleanExpired(tag) {
        this.data[tag].forEach(function(element, index, object) {
            let date = Date.parse(element.timestamp) + (60*60);
            if (new Date() < date) // if expired
                object.splice(index, 1); // remove
        });
        this.Save();
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
