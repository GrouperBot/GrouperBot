import DatabaseUnavailable from '../errors/DatabaseUnavailable';
import { format, MysqlError } from 'mysql';
import { getDB } from '../database';
import NoResult from '../errors/NoResult';
import Tag from './Tag';
import log from '../log';
import to from 'await-to-js';

export default class Advertisement {

    /**
     * 
     * @param {string} poster Snowflake ID of the poster
     * @param {string} posterTag Name#Descrim of the poster
     * @param {Tag[] | string[]} tags Tag instances to use
     * @param {number} players Mumber of players required/needed
     * @param {string} description Description of advertisement
     * @param {number} expiration Unix timestamp to expire at
     */
    constructor(poster, posterTag, tags, players, description, expiration) {

        /**
         * The ID of advertisement
         * 
         * @type {number}
         */
        this.id = -1;

        /**
         * The snowflake ID of the AD poster
         * 
         * @note Since JS is not "64bit", we resort to string instead
         * 
         * @type {string}
         */
        this.poster = poster;

        /**
         * The Name#Descrim of the AD poster
         * 
         * @type {string}
         */
        this.posterTag = posterTag;

        /**
         * Instances of tag
         * 
         * @type {Tag[]}
         */
        this.tags = tags.map(v => {
            if (v instanceof Tag) {
                return v;
            }

            return new Tag(v);
        });

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
     * Get number of minutes lapsed
     * 
     * @return {string}
     */
    getTimeLapsed() {
        const diff = Math.round((Math.floor(Date.now() / 1000) - this.created_at) / 60);

        return `${diff} minutes ago`;
    }

    /**
     * Inserts a new advertisement into database
     * 
     * @async
     * @return {Promise<MysqlError | DatabaseUnavailable | null>}
     */
    async insert() {
        return new Promise(async (resolve, reject) => {
            const stmt = format(
                "INSERT INTO advertisements (`poster`, `posterTag`, `tags`, `players`, `description`, `expiration`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [this.poster, this.posterTag, this.tags.map(t => t.name).join(','), this.players, this.description, this.expiration, Math.floor(Date.now() / 1000)]
            );

            let database, err;

            [ err , database ] = await to(getDB());

            if (err) {
                reject(err);
            }

            database.query(stmt, err => {
                if (err) {
                    log.warn(err);

                    reject(err);
                }

                resolve();
            })
        });
    }

    /**
     * Removes an advertisement by its ID
     * 
     * @return {Promise<MysqlError | DatabaseUnavailable | null>}
     */
    async remove() {
        return new Promise(async (resolve, reject) => {
            const sStmt = "DELETE FROM advertisements WHERE `id` = ?";

            const stmt = format(sStmt, this.id);

            let database, err;

            [ err , database ] = await to(getDB());

            if (err) {
                reject(err);
            }

            database.query(stmt, err => {
                if (err) {
                    log.warn(err);

                    reject(err);
                }

                resolve();
            })
        });
    }

    /**
     * Search advertisement by id
     * 
     * @param {Number} id 
     * 
     * @return {Promise<Advertisement | (NoResult | DatabaseUnavailable | MysqlError)>}
     */
    static async searchById(id) {
        return new Promise(async (resolve, reject) => {
    
            const sStmt = `SELECT * FROM advertisements WHERE \`id\`='${id}' AND \`expiration\` > UNIX_TIMESTAMP();`;

            const stmt = format(sStmt, sStmt);

            let database, err;

            [ err , database ] = await to(getDB());

            if (err) {
                reject(err);
            }

            database.query(stmt, (err, result) => {
                if (err) {
                    log.warn(err);

                    return reject(err);
                }
    
                if (result.length == 0) {
                    return reject(new NoResult('No advertisement found'));
                }

                // There should only be one result for ID search
                result = result[0];

                let a = new Advertisement(
                    result.poster,
                    result.posterTag,
                    result.tags.split(','),
                    result.players,
                    result.description,
                    result.expiration,
                )

                a.setID(result.id);
                a.setCreatedAt(result.created_at);

                resolve(a);
            })
        })
    }

    /**
     * Search advertisement by tag(s)
     * 
     * @param {Tags[] | string[]} tags 
     * 
     * @return {Promise<Advertisement[] | (NoResult | DatabaseUnavailable | MysqlError)>}
     */
    static searchByTags(tags) {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(tags)) {
                reject('Tags is not an array');
            }
    
            tags = tags.map(tag => {
                if ((tag instanceof Tag)) {
                    return tag.name;
                }
    
                return tag;
            });
    
            // Ugly solution as it performs a full-table scan instead of using indexes
            let sStmt = "SELECT * FROM advertisements WHERE FIND_IN_SET(?, `tags`) <> 0";
    
            // Ignore first one as it's already constructed above
            for (let i = 1; i < tags.length; i++) {
                sStmt += " AND FIND_IN_SET(?, `tags`) <> 0";
            }

            sStmt += " AND `expiration` > UNIX_TIMESTAMP()";
    
            const stmt = format(sStmt, [...tags]);

            let database, err;

            [ err , database ] = await to(getDB());

            if (err) {
                reject(err);
            }

            database.query(stmt, (err, results) => {
                if (err) {
                    log.warn(err);

                    return reject(err);
                }
    
                if (results.length == 0) {
                    return reject(new NoResult('No advertisement found'));
                }
    
                resolve(
                    results.map(v => {
                        let a = new Advertisement(
                            v.poster,
                            v.posterTag,
                            v.tags.split(','),
                            v.players,
                            v.description,
                            v.expiration,
                        );
        
                        a.setID(v.id);
                        a.setCreatedAt(v.created_at);
        
                        return a;
                    })
                );
            })
        })
    }
}