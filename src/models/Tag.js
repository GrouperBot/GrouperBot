import { getDB } from '../database';
import Advertisement from './Advertisement';


export default class Tag {
    
    /**
     * Constructs a basic model for tag
     * 
     * @param {string} name Name of the tag 
     * @param {number} [created_at = -1] Unix timestamp this tag was created at (optional)
     */
    constructor(name, created_at = -1) {
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
        this.created_at = created_at;
    }

    /**
     * Inserts a new tag into database
     * 
     * @async
     * @return {Error | null}
     */
    async insert() {
        const stmt = getDB().prepare("INSERT INTO tags (`name`) VALUES (?)");

        stmt.bind(this.name);

        stmt.run(err => {
            return err;
        })
    }

    /**
     * Search advertisement by tag
     * 
     * @async
     * @return {Advertisement[]}
     */
    async searchByTag() {
        const stmt = getDB().prepare("SELECT * FROM advertisements WHERE `tag` = ?");

        stmt.bind(this.name);

        stmt.all((err, rows) => {
            if (err) {
                throw new Error(err);
            }

            return rows.map(v => {
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
