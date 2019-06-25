const fs = require('fs');

class TagManager {

    constructor(filename) {
        this.filename = filename;
        this.data = null;
    }

    Open() {
        this.data = require(this.filename);
    }

    Save() {
        fs.writeFile(this.file, JSON.stringify(this.data), 'utf8', (err, data) => {
            if (err) {
                console.log('error writing database to file');
                console.log(err);
            }
        });
    }

    TagExists(needle) {
        return this.data.find(haystack => haystack == needle) != null;
    }
}

module.exports = TagManager;