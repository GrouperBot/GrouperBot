import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import Advertisement from '../models/Advertisement.js';
import { Embeds } from 'discord-paginationembed';
import to from 'await-to-js';
import Chunk from '../util/Chunk.js';

export default class HelpCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'Help',
            description: 'Shows a list of commands available for use',
        });
    }

    /**
     * Runner for help command
     * 
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        const response = new ResponseBuilder();
        response
            .setTitle("Command Help list")
            .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f5a5.png")
            .setColor("#00FFFF")
            .setFooter("Requested by: " + grouper.getAuthor().tag)

        // Iterate through commandfiles for every file
        this.client.commands.forEach(element => {
        let name = element.name;
        let desc = element.description;
        let dev = element.dev;

        // Pushes the Feild name (command name) Description of the command into embed
        if (!dev) {
            response.addField(name,`	\`\`\`${desc}\`\`\` `,false)
        }
        });

        // Send callback
        grouper.dispatch(response);
    }
}
