import { RichEmbed, Guild } from 'discord.js';
import GrouperClient from '../structures/GrouperClient';
import GrouperNotification from './GrouperNotification';

export default class GuildLeaveNotification extends GrouperNotification {
    /**
     * Creates a new notification handler for when guilds are left
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super(client);
    }

    /**
     * Formatter for leave events
     *
     * @param {Guild} guild - Guild delete event data
     * 
     * @return {RichEmbed}
     */
    format(guild) {
        return new RichEmbed()
            .setThumbnail(guild.iconURL)
            .setTitle('Server Left:')
            .setColor(0xFF0000) // red
            .addField("Name", guild.name, true)
            .addField("Guild Id", guild.id, true)
            .addField("Total Members", guild.memberCount, true)
            .addField("Total Channels", guild.channels.size, true)
            .addField("Guild Owner", guild.owner.user.tag, true) // I'm not sure if owner is present at all times
            .addField("Guild Region", guild.region, true)
            .addField("Creation Date", guild.createdAt.toISOString(), true);
    }
}