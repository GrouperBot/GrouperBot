import { Collection } from "discord.js";
import GrouperClient from "../structures/GrouperClient";

export default class DataStore extends Collection {
    constructor(client) {
        super();

        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;
    }

    /**
     * Inserts into collection if it does not exist already
     * 
     * @param {string} id - Data ID 
     * @param {*} data - Data
     * 
     * @return {*}
     */
    add(id, data) {
        const existing = this.has(id);

        if (existing) {
            return existing;
        }

        this.set(id, data)
    }
}