import GrouperTask from '../structures/GrouperTask';
import GrouperClient from '../structures/GrouperClient';
import { format } from 'mysql';
import { getDB } from '../database';

export default class SweepTask extends GrouperTask {

    /**
     * GrouperClient
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super(client, {
            name: 'Sweep',
            description: 'Sweep expired database entries',
            interval: '*/30 * * * *',
        });
    }

    /**
     * Derived task runner
     * 
     */
    async run() {
        const stmt = format(
            "DELETE FROM advertisements WHERE `expiration` < ?",
            Math.floor(Date.now() / 1000),
        );

        getDB().query(stmt, (err, results) => {
            if (err) {
                return;
            }

            /**
             * Emitted when sweeping is complete
             * 
             * @event GrouperClient#sweeped
             * @param {number} results.affectedRows Number of rows affected or deleted
             */
            this.client.emit('sweeped', results.affectedRows);
        });
    }
}