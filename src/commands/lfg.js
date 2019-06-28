import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import Advertisement from '../models/Advertisement.js';
import { Embeds } from 'discord-paginationembed';
import to from 'await-to-js';
import Chunk from '../util/Chunk.js';

export default class LFGCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'LFG',
            description: 'Add or return list of advertisements',
        });
    }

    /**
     * Runner for tags command
     * 
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        const sArgs = grouper.getArgs();

        if (sArgs.length == 0) {
            return this.dispatchUsage(grouper);
        }

        const response = new ResponseBuilder();

        switch (sArgs[0]) {
            case 'new':

                if (sArgs.length < 4) {
                    return this.dispatchUsage(grouper);
                }

                const tags = sArgs[1].split(',');

                for (let tag of tags) {
                    if (!this.client.tags.has(tag)) {
                        response
                            .setTitle('Invalid tag')
                            .setState(false)
                            .setDescription(`Tag ${tag} does not exist`);

                        return grouper.dispatch(response);
                    }
                }

                let aErr;

                [ aErr ] = await to(
                    new Advertisement(
                        grouper.message.author.id,
                        tags,
                        parseInt(sArgs[2]),
                        grouper.joinArgAfter(3),
                        this.client.getExpireTime(),
                    ).insert()
                );

                if (aErr) {
                    response
                        .setTitle('Creation failed')
                        .setState(false)
                        .setDescription('Database insertion failed')

                    return grouper.dispatch(response);
                }

                response
                    .setTitle('Advertisement created!')
                    .setDescription('You have successfully posted an advertisement')
                
                return grouper.dispatch(response);
            default:
                const dTags = sArgs[0].split(',');

                let err, advertisements;

                [ err, advertisements ] = await to(
                    Advertisement.searchByTags(dTags)
                );

                if (err) {
                    response
                        .setTitle('Failed to retrieve advertisements')
                        .setState(false)
                        .setDescription(`Failed to retrieve advertisements with tag(s): ${dTags.join(', ')}`)
                    
                    return grouper.dispatch(response);
                }

                if (advertisements.length == 0) {
                    response
                        .setTitle('No results')
                        .setDescription(`Found zero listing with tag(s): ${dTags.join(', ')}`)

                    return grouper.dispatch(response);
                }

                let embeds = [], tEmbed;

                let tChunks = Chunk(advertisements, 5);

                for (let outer of tChunks) {
                    tEmbed = new ResponseBuilder();

                    tEmbed.setTitle(`Advertisements | Tags: [${dTags.join(', ')}]`);

                    for (let inner of outer) {
                        tEmbed.addField(
                            `Players needed ${inner.players} | Tags: [${inner.tags.map(t => t.name).join(', ')}]`,
                            inner.description + ` | Posted by <@${inner.poster}>`,
                        );
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

    /**
     * Utility/helper for this command
     * 
     * @param {GrouperMessage} grouper
     */
    dispatchUsage(grouper) {
        const response = new ResponseBuilder();

        response
            .setTitle('Command Usage')
            .addField('Search by tags', `${this.toString()} \`tagName\``)
            .addField('Add Advertisement', `${this.toString()} new \`tag1,tag2\` \`teamSize\` \`description\``)

        return grouper.dispatch(response);
    }
}
