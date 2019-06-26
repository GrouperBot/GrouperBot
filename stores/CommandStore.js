import { Collection } from "discord.js";
import GrouperClient from "../structures/GrouperClient";

export default class CommandStore extends Collection {
    /**
     * Creates a new store for commands
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
    }
}