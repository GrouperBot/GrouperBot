import { getDB } from '../database';
import { format, MysqlError } from 'mysql';
import Advertisement from './Advertisement';


export default class Tag {
    
    /**
     * Constructs a basic model for tag
     * 
     * @param {string} name Name of the tag 
     */
    constructor(name) {
        /**
         * Name of the tag
         * 
         * @type {string}
         */
        this.name = name;

        /**
         * Unix timestamp this tag was created at
         * 
         * @type {number}
         */
        this.created_at = -1;
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
     * Inserts a new tag into database
     * 
     * @async
     * @return {MysqlError | null}
     */
    async insert() {
        const stmt = format(
            "INSERT INTO tags (`name`) VALUES (?)",
            [this.name],
        );

        return getDB().query(stmt, err => err);
    }

    /**
     * Search advertisement by tag
     * 
     * @async
     * @return {Advertisement[]}
     */
    async searchByTag() {
        const stmt = format(
            "SELECT * FROM advertisements WHERE `tag` = ?",
            [this.name],
        );

        getDB().query(stmt, (err, results) => {
            if (err) {
                throw err;
            }

            return results.map(v => {
                let a = new Advertisement(
                    this.name,
                    v.players,
                    v.description,
                    v.expiration,
                    v.created_at,
                );

                a.setID(v.id);
                a.setCreatedAt(v.created_at);

                return a;
            })
        })
    }
}
