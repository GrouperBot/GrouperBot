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
        fs.writeFile(this.filename, JSON.stringify(this.data), 'utf8', (err, data) => {
            if (err) {
                console.log('error writing database to file');
                console.log(err);
            }
        });
    }

    TagExists(needle) {
        return this.data.find(haystack => haystack == needle) != null;
    }

    AddTag(tag) {
        if (this.TagExists(tag))
            return;
        if (!this.data)
            throw new Error('File not yet opened!');
        this.data.push(tag);
        this.Save();
    }

    RemoveTag(tag) {
        if (!this.TagExists(tag))
            return;
        if (!this.data)
        throw new Error('File not yet opened!');
        this.data = this.data.filter(function(value, index, arr) {
            return value != tag;
        });
        this.Save();
    }
}

module.exports = TagManager;