import Tag from './Tag';
import { format, MysqlError } from 'mysql';
import { getDB } from '../database';

export default class Advertisement {

    /**
     * 
     * @param {Tag[] | string[]} tags Tag instances to use
     * @param {number} players Mumber of players required/needed
     * @param {string} description Description of advertisement
     * @param {number} expiration Unix timestamp to expire at
     */
    constructor(tags, players, description, expiration) {

        /**
         * The ID of advertisement
         * 
         * @type {number}
         */
        this.id = -1;

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
     * Inserts a new advertisement into database
     * 
     * @async
     * @return {MysqlError | null}
     */
    async insert() {
        const stmt = format(
            "INSERT INTO advertisements (`tags`, `players`, `description`, `expiration`) VALUES (?, ?, ?, ?)",
            [this.tags.join(','), this.players, this.description, this.expiration]
        );

        return getDB().query(stmt, err => err);
    }

    /**
     * Search advertisement by tag(s)
     * 
     * @param {Tags[] | string[]} tags 
     * 
     * @return {Promise<Advertisement[]>}
     */
    static searchByTags(tags) {
        return new Promise((resolve, reject) => {
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
    
            const stmt = format(sStmt, [...tags]);
    
            getDB().query(stmt, (err, results) => {
                if (err) {
                    throw err;
                }
    
                if (results.length == 0) {
                    return [];
                }
    
                resolve(
                    results.map(v => {
                        let a = new Advertisement(
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