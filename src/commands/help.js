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

        let command = null;

        const args = grouper.getArgs();        
        if (args.length > 0) {
            command = args[0];
        }

        const response = new ResponseBuilder();
        response
            .setTitle("Command Help list")
            .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f5a5.png")
            .setColor("#00FFFF")
            .setFooter("Requested by: " + grouper.getAuthor().tag);

        // Loop commands
        let foundCommand = null;
        this.client.commands.forEach(element => {

        // If we're searching for a command, display help page
        if (command) {
            if (element.name === command) {
                foundCommand = element;
            }
        }
        // Add command info for non development commands
        if (!element.dev) {
            response.addField(element.name,`	\`\`\`${element.description}\`\`\` `, false);
        }
        });

        if (!foundCommand)  // no found command, show help menu
            grouper.dispatch(response);
        else                // command found, show specific help
            foundCommand.help(grouper);
    }
}
