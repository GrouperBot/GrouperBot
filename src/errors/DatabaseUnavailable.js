export default class DatabaseUnavailable extends Error {
    
    /**
     * Database unavailable constructor
     * 
     * @param  {...any} args 
     */
    constructor(...args) {
        super(...args);

        Error.captureStackTrace(this, DatabaseUnavailable);
    }
}
