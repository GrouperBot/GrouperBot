const fs = require('fs');
const discord = require('discord.js');

const DiscordMessageMenu = require('../menu.js');

module.exports.run = async (client, message, args, prefix, tagmngr, db) => {
  args.shift(); // remove first element of array (command name)

  // display menu
  if (args.length == 0) {
    // TODO: Show nice embed error w/ how to properly search tags.
    return;
  }

  let param1 = args[0].toLowerCase();
  if (param1 == 'new') {
    args.shift() // remove "new" from args

    if (args.length < 3){
      // TODO: Show nice embed error showing how to use this command
      return;
    }

    let tag = args[0].toLowerCase();
    if (!tagmngr.TagExists(tag)) {
      // TODO: Show nice embed error w/ valid tags if the one they typed was invalid, and a way to get new tags added.
      // it's also possible that they typed a valid tag, but we just don't have any ads for it, tell them that.
      message.reply(`${args[0]} isn't in db`);
      return;
    }

    let dbentry = {
      "description" : args.slice( 2 ).join(" "),
      "author" : message.author.tag,
      "playernum" : args[1],
      "timestamp" : new Date()
    }

    db.AddEntry(tag, dbentry)
    message.reply("Your Ad has been added to our boards :smile:")
    return;
  } 

  for (tag of Object.keys(db.data)) {
    if (tag == param1) {
      let menu = new DiscordMessageMenu(message, `Ads Board - ${tag.toUpperCase()}`, "#964B00", 4);
      menu.buildMenu(db.GetItems(tag));
      menu.displayPage(0);
      return;
    }
  }

}

module.exports.help = {
    name: "lfg",
    description: "lfg command",
    dev: false
}
