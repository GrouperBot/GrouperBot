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
     * @param {GrouperMessage} grouper
     */
    async run(grouper) {
        // TODO: needs refactoring
        let menu = new DiscordMessageMenu(grouper.message, `Available Tags`, "#b8bbc1", 15);

        menu.buildMenu(this.client.tags.getNameArray());
        menu.setTagList(true);
        menu.displayPage(0);
    }
}
