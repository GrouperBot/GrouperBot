import { createConnection, ConnectionConfig, Connection } from 'mysql';
import { CreateTagTable, CreateAdvertisementTable } from '../util/Constants';

/**
 * Database object
 * 
 * @type {Connection}
 */
let database = null;

/**
 * Initialize connection to database
 * 
 * @param {ConnectionConfig} config Connection configuration
 */
export function initialize(config) {
    database = createConnection(config);

    // Should we be attempting to create database here?
    database.query(CreateTagTable);
    database.query(CreateAdvertisementTable);
}

/**
 * Obtains the database Connection object
 * 
 * @return {Connection}
 */
export function getDB() {
    if (database.state != 'connected') {
        throw new Error('Database uninitialized');
    }

    return database;
}

export default {
    initialize,
    getDB,
};
