import { readdir } from 'fs';
import { Collection } from "discord.js";
import GrouperClient from "../structures/GrouperClient";

export default class CommandStore extends Collection {
    /**
     * Creates a new store for commands
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

    async registerCommandsIn(path) {
        readdir(path, (err, files) => {
            if (err) {
                throw new Error(err);
            }

            const commandFiles = files.filter(f => f.split('.').pop() === 'js');

            if (commandFiles.length == 0)
                return;

            for (let commandFile of commandFiles) {
                // TODO: Not certain about the logistic on this part
            }
        })
    }
}