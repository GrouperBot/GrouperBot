import GrouperClient from './GrouperClient';
import { WSEventType, Collection, Constants, RichEmbed } from 'discord.js';
import GrouperNotification from '../notifications/GrouperNotification';


export default class GrouperNotificationManager {

    /**
     * Creates a new manager for notifications
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {

        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;

        /**
         * Keeps track of registered handlers
         * 
         * @type {Collection}
         */
        this.store = new Collection();
    }

    /**
     * Listens for a specific socket event
     * 
     * @param {WSEventType} event 
     * @param {GrouperNotification} handler 
     */
    listen(event, handler) {
        if (this.client.supportChannel == 0) {
            return;
        }

        this.store.set(event, handler);

        this.client.on(event, params => this.handle(event, params));
    }

    /**
     * Internal event notification handler
     * 
     * @param {WSEventType} event 
     * @param {any} params - Params for event; Check arguments Array object if expecting more than one
     */
    handle(event, params) {
        const handler = this.store.get(event);

        if (!handler) {
            return;
        }

        this.dispatch(handler.format(params));
    }

    /**
     * Dispatch message to support channel
     * 
     * @param {RichEmbed} content 
     */
    dispatch(content) {
        // Sharding will pose problem later in, so let's skip cache all together (Master brings out more abstraction)
        content = content._apiTransform();

        this.client.rest.makeRequest('post', Constants.Endpoints.Channel(this.client.supportChannel).messages, true, {
            content: '',
            embed: content, 
        });
    }
}