export default class DatabaseUnavailable extends Error {
    
    /**
     * Database unavaialble constructor
     * 
     * @param  {...any} args 
     */
    constructor(...args) {
        super(...args);

        Error.captureStackTrace(this, DatabaseUnavailable);
    }
}
