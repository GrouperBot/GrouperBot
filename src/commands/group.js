import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import Advertisement from '../models/Advertisement.js';
import { Embeds } from 'discord-paginationembed';
import to from 'await-to-js';
import Chunk from '../util/Chunk.js';
import log from '../log';
import NoResult from '../errors/NoResult.js';

export default class GroupCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'group',
            description: 'Creates a new advertisment or shows a list of advertisements based on tags',
            aliases: ['groups'],
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

                let description = grouper.joinArgAfter(3);

                if (description.length > 140) { // TODO: configurable?
                    response
                        .setTitle('Description too long')
                        .setState(false)
                        .setDescription(`Please limit your descriptions to be < 140 characters long`);

                    return grouper.dispatch(response);
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
            case 'remove':
                let id = sArgs[1];
                id = id.replace('#', ''); // strip # if they supplied it
                id = parseInt(id);

                let authorId = grouper.message.author.id;

                let bErr, bAdvertisement;

                [ bErr, bAdvertisement ] = await to(
                    Advertisement.searchById(id)
                );

                if (bErr) {
                    response
                        .setTitle('Failed to find advertisment')
                        .setState(false)
                        .setDescription(`SQL Error: Failed to retrieve advertisements with the id: ${id}.`
                        +   `\nPerhaps you mistyped the id value?`);
                    
                    return grouper.dispatch(response);
                }

                if (![
                    grouper.message.author.id,
                    ...this.client.developers,
                ].includes(bAdvertisement.poster)) {
                    response
                        .setTitle('Failed to remove advertisement')
                        .setState(false)
                        .setDescription('Hey, you are not the poster!')

                    return grouper.dispatch(response);
                }

                [ bErr ] = await to(
                    bAdvertisement.remove()
                );

                if (bErr) {
                    log.error(bErr);

                    response
                        .setTitle('Failed to remove advertisment')
                        .setState(false)
                        .setDescription(`Failed to remove advertisement with the id: ${id}.`
                        +   `\nBelieve this is a bug? Please report it!`);
                        
                    return grouper.dispatch(response);
                }

                response
                    .setTitle('Advertisment removed!')
                    .setDescription(`Your advertisment with the ID of # ${id} has been successfully removed!`)

                return grouper.dispatch(response);

            default:
                const dTags = sArgs[0].split(',');

                let err, advertisements;

                [ err, advertisements ] = await to(
                    Advertisement.searchByTags(dTags)
                );

                if (err instanceof NoResult) {
                    response
                        .setTitle('No results found!')
                        .setDescription(
                            `Found zero listings with tag(s): ${dTags.join(', ')}\n\nTry creating a new listing!\n\u200B`
                        );

                    return grouper.dispatch(response);
                }

                if (err) {

                    response
                        .setTitle('Failed to retrieve advertisements')
                        .setState(false)
                        .setDescription(`Failed to retrieve advertisements with tag(s): ${dTags.join(', ')}`)
                    
                    return grouper.dispatch(response);
                }

                let embeds = [], tEmbed;

                let tChunks = Chunk(advertisements, 5);

                for (let outer of tChunks) {
                    tEmbed = new ResponseBuilder();

                    tEmbed
                        .setTitle(`Join a group! | Searching for: ${dTags.join(', ')}`)
                        .setThumbnail("https://i.imgur.com/ILNQjNV.png")
                        .setDescription("Join up with one of the groups below to find some new friends!");

                    for (let inner of outer) {
                        tEmbed.addField(
                            `\u200B`,
                            `\`\`\`scheme\n`
                            + `[+] Tags: ${inner.tags.map(t => t.name).join(', ')}\n`
                            + `[+] Players needed: ${inner.players}\n`
                            + `[+] Description: ${inner.description}\n`
                            + `\`\`\` *Posted by ${inner.posterTag} ${inner.getTimeLapsed()}* | ID #${inner.id}`,
                        );
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
            .isUsage()

        return grouper.dispatch(response);
    }
}