import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';

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
        const sArgs = grouper.getArgs();

        const response = new ResponseBuilder();
        response.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/146/information-source_2139.png");
        if (sArgs.length == 0) {
            response
                .setTitle('Command Help List')

            for (const command of this.client.commands.array()) {
                if (command.developerOnly) {
                    continue;
                }

                response.addField(command.name, `\`\`\`${command.description}\`\`\``)
            }

            return grouper.dispatch(response);
        }

        const sCommand = sArgs[0].toLowerCase();

        if (!this.client.commands.has(sCommand)) {
            response
                .setTitle('Command not found')
                .setState(false)
                .setDescription(`Unable to locate command "${sCommand}"`)

            return grouper.dispatch(response);
        }

        this.client.commands.get(sCommand).help(grouper);
    }

    /**
     * Utility/helper for this command
     * 
     * @param {GrouperMessage} grouper
     */
    async help(grouper) {
        const response = new ResponseBuilder();

        response
            .setTitle('You goof')
            .setDescription('You already in help!')
            .setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/146/keyboard_2328.png");
        return grouper.dispatch(response);
    }
}