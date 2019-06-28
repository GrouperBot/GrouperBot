
export default class NoResult extends Error {
    
    /**
     * No result constructor
     * 
     * @param  {...any} args 
     */
    constructor(...args) {
        super(...args);

        Error.captureStackTrace(this, NoResult);
    }
}
