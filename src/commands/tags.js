import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder';
import { Embeds } from 'discord-paginationembed';
import Chunk from '../util/Chunk';

export default class TagsCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'Tags',
            description: 'Displays a list that shows all of the valid tags.',
        });
    }

    /**
     * Runner for tags command
     * 
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        if (this.client.tags.size == 0) {
            const response = new ResponseBuilder();

                response
                    .setTitle('No tags available!')
                    .setDescription('Start by setting up some tags!');

            return grouper.dispatch(response);
        }

        const tChunks = Chunk(this.client.tags.getNameArray(), 25);

        let embeds = [], tEmbed, i = 0;

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
            .setDescription("Here's a list of all of our tags.")
            .build()
            .catch((e) => {
                const response = new ResponseBuilder()
                    .setTitle('Error!')
                    .setState(false)
                    .setDescription(`Unable to perform operation: ${e.message}`);

                grouper.dispatch(response);
            });
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
            .setDescription(`*${this.description}*`)
            .addHelpField('Display tags', this.toString() + '')
            .isUsage()

        return grouper.dispatch(response);
    }
}
