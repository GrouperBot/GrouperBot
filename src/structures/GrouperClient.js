import { Client, ClientOptions, Snowflake } from 'discord.js';
import LoadTags from '../util/LoadTags';
import TagStore from '../stores/TagStore';
import TaskStore from '../stores/TaskStore';
import CommandStore from '../stores/CommandStore';
import GrouperCommandRouter from './GrouperCommandRouter';

// Notifications
import CommandNotification from '../notifications/CommandNotification';
import GrouperNotificationManager from './GrouperNotificationManager';
import GuildJoinNotification from '../notifications/GuildJoinNotification';
import GuildLeaveNotification from '../notifications/GuildLeaveNotification';

export default class GrouperClient extends Client {

    /**
     * @typedef {ClientOptions} GrouperClientOptions
     * @property {string} [commandPrefix="?"] Command prefix
     * @property {string} developers List of developer ids separated by comma
     * @property {number} adDuration - Duration of ads in seconds
     * @property {Snowflake} supportChannel - Snowflake of support channel
     * @property {Snowflake} tagRequestChannel - Snowflake of support channel
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
         * Client's task store
         *
         * @type {TaskStore}
         */
        this.tasks = new TaskStore(this);

        /**
         * Client's notification store
         *
         * @type {GrouperNotificationManager}
         */
        this.notifications = new GrouperNotificationManager(this);

        /**
         * Client's command router
         *
         * @type {GrouperCommandRouter}
         */
        this.router = new GrouperCommandRouter(this, {
            prefix: options.prefix || '?',
        });

        /** Client's support channel snowflake
         *
         * @type {Snowflake}
         */
        this.supportChannel = options.supportChannel || 0;

        /** Client's tag request channel snowflake
         *
         * @type {Snowflake}
         */
        this.tagRequestChannel = options.requestChannel || 0;
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
        });

        this.notifications.listen('guildCreate', new GuildJoinNotification(this));
        this.notifications.listen('guildDelete', new GuildLeaveNotification(this));
        this.notifications.listen('commandExecuted', new CommandNotification(this));

        return this;
    }
}
