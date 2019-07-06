import { RichEmbed, Guild } from 'discord.js';
import GrouperClient from '../structures/GrouperClient';
import GrouperNotification from './GrouperNotification';

export default class GuildJoinNotification extends GrouperNotification {
    /**
     * Creates a new notification handler for when guilds are joined
     * 
     * @param {GrouperClient} client 
     */
    constructor(client) {
        super(client);
    }

    /**
     * Formatter for join events
     *
     * @param {Guild} guild - Guild create event data
     * 
     * @return {RichEmbed}
     */
    format(guild) {
        return new RichEmbed()
            .setThumbnail(guild.iconURL)
            .setTitle('Server Joined:')
            .setColor(0x00FF00) // green
            .addField("Name", guild.name, true)
            .addField("Guild Id", guild.id, true)
            .addField("Total Members", guild.memberCount, true)
            .addField("Total Channels", guild.channels.size, true)
            .addField("Guild Owner", guild.owner.user.tag, true) // I'm not sure if owner is present at all times
            .addField("Guild Region", guild.region, true)
            .addField("Creation Date", guild.createdAt.toISOString(), true);
    }
}