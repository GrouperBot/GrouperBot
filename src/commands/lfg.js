import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import Advertisement from '../models/Advertisement.js';
import to from 'await-to-js';

const DiscordMessageMenu = require('../menu.js');

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
                        tags,
                        parseInt(sArgs[2]),
                        grouper.joinArgAfter(3),
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
                    
                    grouper.dispatch(response);
                }

                //TODO: Check advertisements length and display no results found

                response
                    .setTitle(`Latest 25 Advertisements Tags: [${dTags.join(', ')}]`)

                for (let ad of advertisements) {
                    response.addField(
                        `Players needed: ${ad.players} (${ad.tags.map(t => t.name).join(', ')})`,
                        ad.description
                    );
                }

                grouper.dispatch(response);
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
