import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import { Constants, RichEmbed } from 'discord.js';

export default class RequestCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'Request',
            description: 'Request a new tag to be added',
        });
    }

    /**
     * Runner for help command
     *
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        const response = new ResponseBuilder();

        if (!this.client.tagRequestChannel) {
            response
                .setTitle('Tag requested not allowed')
                .setState(false)
                .setDescription('Tag request is not enabled on this bot');

            return grouper.dispatch(response);
        }

        const sArgs = grouper.getArgs();

        // Make sure that there is a tag and a reason
        if (sArgs.length < 2) {
            return this.help(grouper);
        }

        const sTag = sArgs[0];

        // Makes sure people arent requesting already implemented tags
        if (this.client.tags.has(sTag)) {
            response
                .setTitle('Tag already exist')
                .setState(false)
                .setDescription(`Tag "${sTag}" already exist within the database`)

            return grouper.dispatch(response);
        }

        response
            .addField(`**${sTag}**`, `\`\`\`${grouper.joinArgAfter(1)}\`\`\``);

        return this.dispatch(response);
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
            .addHelpField('Request a tag', `${this.toString()} \`<tagName>\` \`<reason>\``)
            .isUsage()

        grouper.dispatch(response);
    }

    /**
     * Utility/helper for this command
     *
     * @param {GrouperMessage} grouper
     * @param {RichEmbed} content
     */
    dispatch(content) {
        // Sharding will pose problem later in, so let's skip cache all together (Master brings out more abstraction)
        content = content._apiTransform();

        this.client.rest.makeRequest('post', Constants.Endpoints.Channel(this.client.tagRequestChannel).messages, true, {
            content: '',
            embed: content,
        });
    }
}
