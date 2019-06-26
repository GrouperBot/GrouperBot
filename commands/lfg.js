const fs = require('fs');
const discord = require('discord.js');

const DiscordMessageMenu = require('../menu.js');

module.exports.run = async (client, message, args, prefix, tagmngr, db) => {

  args.shift(); // remove first element of array (command name)

  // length of arg 0 means show ads
  if (args.length == 0) {
    // TODO: Make a way to append data to the json
    return
  } else {
    // Searching Algorithm of finding tags
    if ( args[0].toLowerCase() != "new" ) {
      // Nested loop to iterate through all the json data to find tag
      for ( tag of Object.keys( db.data ) ) {

        // Found Tag
        if (tag.toLowerCase() == args[0].toLowerCase()){
          let menu = new DiscordMessageMenu(message, `Ads Board - ${tag.toUpperCase()}`, "#964B00", 4);
          menu.buildMenu(db.data[tag]);
          menu.displayPage(0);
          return;
        }
      }

      message.reply( `Sorry I couldn't find the tag " ${args[0]} " ` )
    } else {
      args.shift() // remove "new" from args

      if (args.length >= 3){

        // if user tag in tag list then add it two database
        if (tagmngr.data.includes(args[0])) {
          db.data[args[0]].push( {"description" : args.slice( 3 ).join(" "),"author" : message.author.tag,"playernum" : args[1],"timestamp" : new Date()} )
          message.reply("Your Ad has been added to our boards :smile:")
          db.Close()
          // db.Save()
        } else {
          message.reply(`${args[0]} isn't in db`)
        }
      }
      }
    }
}

module.exports.help = {
    name: "lfg",
    description: "lfg command",
    dev: false
}
