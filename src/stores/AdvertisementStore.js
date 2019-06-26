import { Collection } from "discord.js";
import GrouperClient from "../structures/GrouperClient";

export default class AdvertisementStore extends Collection {

    /**
     * Creates a new store for advertisements
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super();
        
        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;
    }
}