import { RichEmbed } from 'discord.js';
import GrouperClient from '../structures/GrouperClient';
import GrouperMessage from '../structures/GrouperMessage';
import GrouperNotification from './GrouperNotification';

export default class CommandNotification extends GrouperNotification {
    /**
     * Creates a new notification handler for when a command is executed
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super(client);
    }

    /**
     * Formatter for command events
     *
     * @param {GrouperMessage} message - Message command executed
     * 
     * @return {RichEmbed}
     */
    format(message) {
        return new RichEmbed()
            .setThumbnail(message.getAuthor().displayAvatarURL)
            .setTitle('Command Attempted:')
            .addField("Author", message.getAuthor().tag, true)
            .addField("Command", `\`${message.message.content}\``, true)
            .addField("Guild",  message.message.guild.name, true)
            .addField("Guild ID", message.message.guild.id, true)
    }
}