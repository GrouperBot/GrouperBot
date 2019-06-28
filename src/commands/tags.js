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

        for (let outer of tChunks) {
            tEmbed = new ResponseBuilder();

            tEmbed.setTitle('Available tags');

            for (let inner of outer) {
                tEmbed.addField('`' + inner + '`', '\u200B', true);
            }

            embeds.push(tEmbed);
        }

        new Embeds()
            .setArray(embeds)
            .showPageIndicator(true)
            .setAuthorizedUsers([grouper.message.author.id])
            .setChannel(grouper.message.channel)
            .build();
    }
}
