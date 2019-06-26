import { Message } from "discord.js";
import GrouperCommand from "./GrouperCommand";
import { ArgRegex } from "../util/constants";

export default class GrouperMessage extends Message {
    constructor(...args) {
        super(...args);

        /**
         * Command that this message triggers
         * 
         * @type {GrouperCommand}
         */
        this.command = null;

        /**
         * Argument string (excluding command name)
         * 
         * @type {string}
         */
        this.argString = this.content.match(ArgRegex).shift().join(' ');
    }

    /**
     * Set a command object to the message
     * 
     * @param {GrouperCommand} command - Command to set it to 
     */
    setCommand(command) {
        this.command = command;
    }

    /**
     * Get array of arguments (minus the command name)
     * 
     * @return {string[]}
     */
    getArgs() {
        let args = this.content.match(ArgRegex)

        args.shift()

        return args;
    }
}