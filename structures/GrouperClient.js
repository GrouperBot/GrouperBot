import { Client } from 'discord.js';
import TagStore from '../stores/TagStore';
import AdvertisementStore from '../stores/AdvertisementStore';
import CommandStore from '../stores/CommandStore';

export default class GrouperClient extends Client {
    constructor(options = {}) {
        super(options);

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
    }
}