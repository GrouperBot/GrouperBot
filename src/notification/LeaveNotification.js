import { RichEmbed, Guild } from "discord.js";
import GrouperClient from "../structures/GrouperClient";
import Notification from './Notification.js'

export default class LeaveNotification extends Notification {
    /**
     * Creates a new notification handler for when guilds are left
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
     * @param {Guild} data - Data
     * 
     * @return {RichEmbed}
     */
    buildEmbed(data) {
        const embed = new RichEmbed()
            .setThumbnail(data.iconURL)
            .setTitle('Server Left:')
            .setColor(0xFF0000) // red
            .addField("Name", data.name, true)
            .addField("Guild Id", data.id, true)
            .addField("Total Members", data.memberCount, true)
            .addField("Total Channels", data.channels.array.length, true)
            .addField("Guild Owner", data.owner.user.tag, true)
            .addField("Guild Region", data.region, true)
            .addField("Creation Date", data.createdAt.toISOString(), true);

        return embed;
    }
}