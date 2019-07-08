export default class GrouperTask {

    /**
     * @typedef {Object} TaskInfo
     * @property {string} name - Name of the task
     * @property {string} description - Description of the task
     * @property {string} interval - Interval of the task (cron format)
     */

    /**
     * Create a new base task object
     * 
     * @param {GrouperClient} client - Client object of Grouper
     * @param {TaskInfo} info - Task information
     */
    constructor(client, info) {
        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;

        /**
         * Task name
         * 
         * @type {string}
         */
        this.name = info.name.toLowerCase();

        /**
         * Task description
         * 
         * @type {string}
         */
        this.description = info.description || '';

        /**
         * Task interval
         * 
         * @type {string}
         */
        this.interval = info.interval;
    }

    /**
     * Abstraction interface for tasks
     * 
     * @abstract
     * 
     */
    async run() {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }
}
