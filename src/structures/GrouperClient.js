import { Client, ClientOptions } from 'discord.js';
import TagStore from '../stores/TagStore';
import AdvertisementStore from '../stores/AdvertisementStore';
import CommandStore from '../stores/CommandStore';
import GrouperCommandRouter from '../handlers/GrouperCommandRouter';

export default class GrouperClient extends Client {

    /**
     * @typedef {ClientOptions} GrouperClientOptions
     * @property {string} [commandPrefix=";"] Command prefix
     * @property {string} developers List of developer ids separated by comma
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
        this.developers = options.developers.split(',');

        /**
         * Client's tag store
         * 
         * @type {TagStore}
         */
        this.tags = new TagStore(this);

        /**
         * Client's advertisement store
         * 
         * @type {AdvertisementStore}
         */
        this.advertisements = new AdvertisementStore(this);

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
            prefix: options.prefix ? options.prefix : ';',
        });
    }

    hookRouter() {
        this.on('message', (message) => {
            this.router.route(message);
        });
    }
}