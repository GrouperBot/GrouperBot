import { Client, ClientOptions } from 'discord.js';
import LoadTags from '../util/LoadTags';
import TagStore from '../stores/TagStore';
import NotificationStore from '../stores/NotificationStore';
import CommandStore from '../stores/CommandStore';
import GrouperCommandRouter from './GrouperCommandRouter';

// notifications
import JoinNotification from '../notification/JoinNotification';
import LeaveNotification from '../notification/LeaveNotification';
import CommandNotification from '../notification/CommandNotification';

export default class GrouperClient extends Client {

    /**
     * @typedef {ClientOptions} GrouperClientOptions
     * @property {string} [commandPrefix="?"] Command prefix
     * @property {string} developers List of developer ids separated by comma
     * @property {number} adDuration - Duration of ads in seconds
     */

    /**
     * Constructs a new grouper client
     * 
     * @param {GrouperClientOptions} options 
     */
    constructor(options = {}, supportInfo) {
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
         * Client's notification store
         * 
         * @type {NotificationStore}
         */
        this.notifications = new NotificationStore(this);

        /**
         * Client's command router
         * 
         * @type {GrouperCommandRouter}
         */
        this.router = new GrouperCommandRouter(this, {
            prefix: options.prefix || '?',
        });

        /**
         * Client's support guild snowflake
         * 
         * @type {String}
         */
        this.supportguild = supportInfo.guild;

        /** Client's support channel snowflake
         * 
         * @type {String}
         */
        this.supportchannel = supportInfo.channel;
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

        // we have to wait until ready event that way we can reliably loop through guilds and channels
        this.on('ready', () => {

            // let's maintain bcompat and keep this field optional
            if (!this.supportguild || !this.supportchannel)
                return;

            this.notifications.add('join', new JoinNotification(this, this.supportguild, this.supportchannel));
            this.notifications.add('leave', new LeaveNotification(this, this.supportguild, this.supportchannel));
            this.notifications.add('cmd', new CommandNotification(this, this.supportguild, this.supportchannel));
        });

        this.on('guildCreate', (g) => {
            const notification = this.notifications.get('join');
            if (!notification)
                return;

            const embed = notification.buildEmbed(g);
            notification.dispatch(embed);
        });
        this.on('guildDelete', (g) => {
            const notification = this.notifications.get('leave');
            if (!notification)
                return;

            const embed = notification.buildEmbed(g);
            notification.dispatch(embed);
        });
        return this;
    }
}