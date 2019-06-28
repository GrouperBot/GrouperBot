import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder';
import { Embeds } from 'discord-paginationembed';
import Chunk from '../util/Chunk';

export default class TagsCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'Tags',
            description: 'Return a list of all available tags',
        });
    }

    /**
     * Runner for tags command
     * 
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        let embeds = [];

        const tChunks = Chunk(this.client.tags.getNameArray(), 25);

        let tEmbed;
        let i = 0;
        for (let outer of tChunks) {
            i += 1;
            tEmbed = new ResponseBuilder();

            tEmbed.setTitle('Available tags');

            for (let inner of outer) {
                tEmbed.addField(`\u2022 ${inner}`, '\u200B', true);
            }

            embeds.push(tEmbed);
        }

        // hack for discord alignment
        i = i % 3;
        while (i > 0) {
            tEmbed.addField('\u200B', `\u200B`, true);
            i -= 1;
        }

        new Embeds()
            .setArray(embeds)
            .setTimeout(30 * 1000)
            .showPageIndicator(true)
            .setAuthorizedUsers([grouper.message.author.id])
            .setChannel(grouper.message.channel)
            .setDescription("Here's a list of all of our tags. Missing one? Request one by doing <TODO>!")
            .build();
    }

    /**
     * Utility/helper for this command
     * 
     * @param {GrouperMessage} grouper
     */
    async help(grouper) {
        const response = new ResponseBuilder();

        response
            .setTitle('Command Usage')
            .addField('Display tags', this.toString())

        return grouper.dispatch(response);
    }
}
