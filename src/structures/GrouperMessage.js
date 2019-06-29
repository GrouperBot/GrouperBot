import { Message, StringResolvable, MessageOptions, RichEmbed, Attachment, Author } from "discord.js";
import GrouperCommand from "./GrouperCommand";
import { ArgRegex } from "../util/Constants";

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
    dispatch(content, options) {
        if (content instanceof RichEmbed) {
            content.setFooter(`Requested by ${this.message.author.tag}`);
        }

        return this.message.channel.send(content, options)
    }

    /**
     * Shortcut to this.message.author
     * 
     * @return {Author}
     */
    getAuthor() {
        return this.message.author;
    }
    /**
     * Argument string (excluding command name)
     * 
     * @return {string}
     */
    getArgString() {
        const rMatch = this.message.content.match(ArgRegex);

        if (rMatch == null) {
            return '';
        }

        return rMatch.slice(1).join(' ');
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

    /**
     * Piece together remaining args as a string
     * 
     * @param {number} index - Index of the arg to start joining together 
     * 
     * @return {string}
     */
    joinArgAfter(index) {
        return this.getArgs().slice(index).join(' ');
    }
}