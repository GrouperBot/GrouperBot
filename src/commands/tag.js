import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import Tag from '../models/Tag.js';
import to from 'await-to-js';

export default class TagCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'Tag',
            description: 'Register or remove a tag',
        });
    }

    /**
     * Runner for tags command
     * 
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        const sArgs = grouper.getArgs();

        const response = new ResponseBuilder();

        if (sArgs.length < 2) {
            response
                .setTitle('Invalid syntax')
                .setState(false)
                .setDescription('You botched it') // TODO: may need alternative wording

            grouper.message.channel.send(response);

            return;
        }

        const nTag = new Tag(sArgs[1]);

        switch (sArgs[0]) {
            case 'add':
                if (this.client.tags.has(nTag.name)) {
                    response
                        .setTitle('Tag already exist')
                        .setState(false)
                        .setDescription(`Tag "${nTag.name}" already exist within the database`)

                    grouper.message.channel.send(response);

                    return;
                }

                response
                    .setTitle('Successfully created!')
                    .setDescription(`Tag "${nTag.name}" has been created`);

                // Update local storage
                this.client.tags.add(nTag.name, nTag);
                nTag.insert();

                grouper.message.channel.send(response);

                break;
            case 'remove':
                if (!this.client.tags.has(nTag.name)) {
                    response
                        .setTitle('Tag does not exist')
                        .setState(false)
                        .setDescription('Attempted to remove a tag that does not exist')

                    grouper.message.channel.send(response);

                    return;
                }

                response
                    .setTitle('Successfully removed')
                    .setDescription(`Tag "${nTag.name}" has been removed from database`)

                this.client.tags.delete(nTag.name);
                nTag.remove();

                grouper.message.channel.send(response);

                break;
            default:
                response
                    .setTitle('Invalid action')
                    .setState(false)
                    .setDescription('Valid actions are "add" and "remove"')

                grouper.message.channel.send(response);
        }
    }
}
