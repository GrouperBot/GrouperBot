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
            description: 'Creates a new advertisment or shows a list of advertisements based on tags',
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
            return this.help(grouper);
        }

        const response = new ResponseBuilder();

        switch (sArgs[0]) {
            case 'new':

                if (sArgs.length < 4) {
                    return this.help(grouper);
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

                let players = parseInt(sArgs[2], 10);

                if (!players) {
                    return this.help(grouper);
                }

                let aErr;

                [ aErr ] = await to(
                    new Advertisement(
                        grouper.message.author.id,
                        grouper.message.author.tag,
                        tags,
                        players,
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

                let embeds = [], tEmbed, counter = 0;

                let tChunks = Chunk(advertisements, 5);

                for (let outer of tChunks) {
                    tEmbed = new ResponseBuilder();

                    tEmbed
                        .setTitle(`Advertisements | Tags: [${dTags.join(', ')}]`)
                        .setDescription('\u200B');

                    for (let inner of outer) {
                        counter++;

                        tEmbed.addField(
                            `[${inner.tags.map(t => t.name).join(', ')}] | Players needed: ${inner.players}`,
                            `\`\`\`${inner.description}\`\`\` Posted by ${inner.posterTag} | ${inner.getTimeLapsed()}`,
                        );

                        if (counter < outer.length)
                            tEmbed.addBlankField();
                    }

                    embeds.push(tEmbed);
                }

                new Embeds()
                    .setArray(embeds)
                    .setTimeout(30 * 1000)
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
    async help(grouper) {
        const response = new ResponseBuilder();

        response
            .setTitle('Command Usage')
            .setDescription(`*${this.description}*`)
            .addHelpField('Search by tags', `${this.toString()} \`<tagName>\``)
            .addHelpField('Add Advertisement', `${this.toString()} new \`<tag1,tag2,...>\` \`<teamSize>\` \`<description>\``)
            .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/146/keyboard_2328.png");

        return grouper.dispatch(response);
    }
}
