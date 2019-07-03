import GrouperClient from '../structures/GrouperClient';
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
 * @param {GrouperClient} client Grouper client
 * @param {ConnectionConfig} config Connection configuration
 */
export function initialize(client, config, retry = false) {
    database = createConnection(config);

    // Should we be attempting to create database here?
    database.query(CreateTagTable);
    database.query(CreateAdvertisementTable);

    database.on('connect', () => {
        if (!retry) {
            /**
             * Emitted when the database is first initialized
             * 
             * @event GrouperClient#databaseInitialized
             */
            client.emit('databaseInitialized');
        }
    });
    database.on('error', (err) => {
        if (!err.fatal)
            return;

        /**
         * Emitted when the database connection dropped and is retrying
         * 
         * @event GrouperClient#databaseRetry
         */
        client.emit('databaseRetry');

        // We'll create a delay here that way we're not spamming reconnection attempts
        setTimeout(() => {
            initialize(client, config, true);
        }, 1000); // milliseconds
    });

}

/**
 * Obtains the database Connection object
 * 
 * @return {Connection}
 */
export function getDB() {
    if (!['authenticated', 'connected'].includes(database.state)) {
        throw new Error('Database uninitialized');
    }

    return database;
}

export default {
    initialize,
    getDB,
};
