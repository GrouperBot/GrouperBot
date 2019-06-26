import { Database as SQLite } from 'sqlite3';
import { CreateTagTable, CreateAdvertisementTable } from '../util/Constants';

/**
 * Database object
 * 
 * @type {SQLite}
 */
let database = null;

/**
 * Prepares database for r/w
 * 
 * @param {string} filename SQLite database filename
 */
export function initialize(filename) {
    database = new SQLite(__dirname + '/storage/' + filename);

    // Should we be attempting to create database here?
    database.run(CreateTagTable);
    database.run(CreateAdvertisementTable);
}

/**
 * Obtains the database object
 * 
 * @return {SQLite}
 */
export function getDB() {
    if (database == null) {
        throw new Error('Database uninitialized');
    }

    return database;
}

export default {
    initialize,
    getDB,
};
