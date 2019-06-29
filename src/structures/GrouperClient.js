import { Client, ClientOptions } from 'discord.js';
import LoadTags from '../util/LoadTags';
import TagStore from '../stores/TagStore';
import CommandStore from '../stores/CommandStore';
import GrouperCommandRouter from './GrouperCommandRouter';

export default class GrouperClient extends Client {

    /**
     * @typedef {ClientOptions} GrouperClientOptions
     * @property {string} [commandPrefix=";"] Command prefix
     * @property {string} developers List of developer ids separated by comma
     * @property {number} adDuration - Duration of ads in seconds
     */

    /**
     * Constructs a new grouper client
     * 
     * @param {GrouperClientOptions} options 
     */
    constructor(options = {}) {
        super(options);

        /**
         * Array of developer ids
         * 
         * @type {string[]}
         */
        this.developers = options.developers ? options.developers.split(',') : [];

        /**
         * Advertisement duration
         * 
         * @type {number}
         */
        this.adDuration = parseInt(options.adDuration) || 3600;

        /**
         * Client's tag store
         * 
         * @type {TagStore}
         */
        this.tags = new TagStore(this);

        /**
         * Client's command store
         * 
         * @type {CommandStore}
         */
        this.commands = new CommandStore(this);

        /**
         * Client's command router
         * 
         * @type {GrouperCommandRouter}
         */
        this.router = new GrouperCommandRouter(this, {
            prefix: options.prefix || ';',
        });
    }

    /**
     * Checks if user ID is within developers array
     * 
     * @param {string} id ID of the user
     */
    isDeveloper(id) {
        return this.developers.includes(id);
    }

    /**
     * Get the future expiration timestamp
     * 
     * @return {number} Expiration time
     */
    getExpireTime() {
        return Math.floor(Date.now() / 1000) + this.adDuration;
    }

    hook() {
        this.on('message', (message) => {
            this.router.route(message);
        });

        this.on('databaseInitialized', () => {
            LoadTags(this);
        })

        return this;
    }
}