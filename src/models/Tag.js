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
         * @note This is not available within Achievement.searchByTags, you must reference client tag store for it.
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
     * @return {Promise<MysqlError | null>}
     */
    async insert() {
        return new Promise((resolve, reject) => {
            const stmt = format(
                "INSERT INTO tags (`name`, `created_at`) VALUES (?, ?)",
                [this.name, Math.floor(Date.now() / 1000)],
            );
    
            getDB().query(stmt, err => {
                if (err) {
                    reject(err);

                    resolve();
                }
            });
        });
    }

    /**
     * Deletes a tag from database
     * 
     * @async
     * @return {Promise<MysqlError | null>}
     */
    async remove() {
        return new Promise((resolve, reject) => {
            const stmt = format(
                "DELETE FROM tags WHERE `name` = ?",
                [this.name],
            );
    
            getDB().query(stmt, err => {
                if (err) {
                    reject(err);

                    resolve();
                }
            });
        });
    }
}
