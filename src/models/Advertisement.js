import Tag from './Tag';
import { format, MysqlError } from 'mysql';
import { getDB } from '../database';

export default class Advertisement {

    /**
     * 
     * @param {Tag} tag Instance of the tag to use
     * @param {number} players Mumber of players required/needed
     * @param {string} description Description of advertisement
     * @param {number} expiration Unix timestamp to expire at
     */
    constructor(tag, players, description, expiration) {

        /**
         * The ID of advertisement
         * 
         * @type {number}
         */
        this.id = -1;

        /**
         * The instance of tag
         * 
         * @type {Tag}
         */
        this.tag = tag;

        /**
         * The number of players needed
         * 
         * @type {number}
         */
        this.players = players;

        /**
         * The description of advertisement
         * 
         * @type {string}
         */
        this.description = description;

        /**
         * Expiration timestamp of this advertisement
         * 
         * @type {number}
         */
        this.expiration = expiration;
        
        /**
         * Unix timestamp that this advertisement was created at
         * 
         * @type {number}
         */
        this.created_at = -1;
    }

    /**
     * Sets the ID of this advertisement
     * 
     * @param {number} id ID of this advertisement
     */
    setID(id) {
        this.id = id;
    }

    /**
     * Sets the created at unix timestamp
     * 
     * @param {number} created_at - Unix timestamp this was created at
     */
    setCreatedAt(created_at) {
        this.created_at = created_at;
    }

    /**
     * Inserts a new advertisement into database
     * 
     * @async
     * @return {MysqlError | null}
     */
    async insert() {
        const stmt = format(
            "INSERT INTO advertisements (`tag`, `players`, `description`, `expiration`) VALUES (?, ?, ?, ?)",
            [this.tag.name, this.players, this.description, this.expiration]
        );

        return getDB().query(stmt, err => err);
    }
}