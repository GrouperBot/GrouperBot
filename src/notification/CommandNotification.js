import { RichEmbed, Message} from "discord.js";
import GrouperClient from "../structures/GrouperClient";
import Notification from './Notification.js'

export default class CommandNotification extends Notification {
    /**
     * Creates a new notification handler for when a command is executed
     * 
     * @param {GrouperClient} client 
     * @param {String} guild - Support server snowflake
     * @param {String} channel - Alert channel snowflake
     */
    constructor(client, guild, channel) {
        super(client, guild, channel);
    }

    /**
     * Builds an embed based off of the information passed into data
     * 
     * @param {Message} data - Data
     * 
     * @return {RichEmbed}
     */
    buildEmbed(data) {
        const embed = new RichEmbed()
            .setThumbnail(data.author.displayAvatarURL)
            .setTitle('Command Attempted:')
            .addField("Author", data.author.tag, true)
            .addField("Command", `\`${data.content}\``, true)
            .addField("Guild", data.guild.name, true)
            .addField("Guild ID", data.guild.id, true)

        return embed;
    }
}