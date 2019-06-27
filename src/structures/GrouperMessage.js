import { Message } from "discord.js";
import GrouperCommand from "./GrouperCommand";
import { ArgRegex } from "../util/constants";

export default class GrouperMessage {

    /**
     * Constructs a grouper message
     * 
     * @param {Message} message 
     */
    constructor(message) {
        /**
         * Underlying DJS message
         * 
         * @type {Message}
         */
        this.message = message;

        /**
         * Command that this message triggers
         * 
         * @type {GrouperCommand}
         */
        this.command = null;
    }

    /**
     * Shortcut to this.message.channel.send()
     * 
     * @param {StringResolvable} content
     * @param {MessageOptions | RichEmbed | Attachment} [options={}]
     * 
     * @return {Promise<Message | Message[]}
     */
    dispatch(content, options = {}) {
        return this.message.channel.send(content, options)
    }

    /**
     * Argument string (excluding command name)
     * 
     * @return {string}
     */
    getArgString() {
        return this.message.content.match(ArgRegex).slice(1).join(' ');
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
        let args = this.message.content.match(ArgRegex)

        args.shift()

        return args;
    }
}