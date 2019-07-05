import GrouperClient from "../structures/GrouperClient";

export default class Notification {
    /**
     * Creates a new store for commands
     * 
     * @param {GrouperClient} client 
     */
    constructor(client, guild, channel) {
        /**
         * GrouperClient
         * 
         * @type {GrouperClient}
         */
        this.client = client;
        let supportGuild = null;
        client.guilds.forEach((g) => {
            if (g.id == guild) {
                supportGuild = g;
                return;
            }
        });

        if (!supportGuild)
            throw new Error("Unable to find support guild, has this been entered incorrectly?");

        let supportChannel = null;
        supportGuild.channels.forEach((c) => {
            if (c.id == channel) {
                supportChannel = c;
            }
        });

        if (!supportChannel)
            throw new Error("Unable to find support channel, has this been entered incorrectly?");

        /**
         * Channel
         *
         * @type {Channel}
         */
        this.channel = supportChannel;
    }

    /** 
     * Sends an embed to the support channel
     * 
     * @param {RichEmbed} embed - Discord Embed to send
     * 
     * @return {*}
     */
    dispatch(embed) {
        this.channel.send(embed);
    }

    /**
     * Builds an embed based off of the information passed into data
     * 
     * @param {*} data - Data
     * 
     * @return {*}
     */
    buildEmbed(data) {
        throw new Error("Unimplemented add() call detected. This error is unrecoverable and programmer error.");
    }
}