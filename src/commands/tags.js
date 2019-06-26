import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import DiscordMessageMenu from '../menu';

export default class TagsCommand extends GrouperCommand {
    constructor(client) {
        super(client, {
            name: 'Tags',
            description: 'Return a list of all available tags',
        });
    }

    /**
     * Runner for tags command
     * 
     * @param {GrouperMessage} message 
     */
    async run(message) {
        // TODO: needs refactoring
        let menu = new DiscordMessageMenu(message, `Available Tags`, "#b8bbc1", 15);

        menu.buildMenu(this.client.tags.array())
        menu.setTagList(true);
        menu.displayPage(0);
    }
}
