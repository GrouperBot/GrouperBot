const discord = require('discord.js');
const DiscordMessageMenu = require('../menu.js');

module.exports.run = async (client, message, args, prefix, tagmngr) => {
    let menu = new DiscordMessageMenu(message, `Available Tags`, "#b8bbc1", 15);
    menu.buildMenu(tagmngr.data);
    menu.setTagList(true);
    menu.displayPage(0);
}

module.exports.help = {
    name: "tags",
    description: "displays the list of available tags",
    dev: false
}
