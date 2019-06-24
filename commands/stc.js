const filename = __dirname.replace("commands","tc.json")
var fs = require('fs');

module.exports.run = async (client, message, args, prefix) => {

    const DiscordConfig = require(filename);

    if (!message.member.hasPermission("MANAGE_CHANNELS",true,true,true)){ message.reply("Sorry You dont have the `MANAGE_CHANNELS` permission in any of your roles").then().catch(console.error);return; }

    // Checks if categoryID is already in the json
    if (args[1] == DiscordConfig[message.guild.id]){message.reply(`${message.guild.channels.get(args[1]).name} is already the Temp Category`);return;}

    // Checks if correct amount of args
    if (args.length == 1){message.reply(`Sorry but stc command takes **1 parameter**. Example \`\`\`${prefix}${args[0]} <Catagory id>\`\`\``);return}

    // Checks if the ID is a channel id
    if (message.guild.channels.has(args[1])){
      const channel = message.guild.channels.get(args[1]) // Grabs Channel Collection
      if (channel.type != "category"){message.reply(`Sorry " ${channel.name} " is not a category`).then().catch(console.error);return;} // Checks if Channel is a Catagory

      // Update JSON
      DiscordConfig[`${message.guild.id}`] = args[1]

      fs.writeFile(filename,JSON.stringify(DiscordConfig,null,2),function(err){if (err){message.reply("Sorry an error occured please contact owner of server so he can report this to the Devolper")}})

      // Success Reply
      message.reply(`Temp Channel Category has been set to " ${channel.name} "`)

    } else {
      // Failure Reply
      message.reply("Please set a parameter after `!stc` -- example `!stc categoryID` ")
    }


}

module.exports.help = {
    name: "stc",
    description: "Sets your Tempory Channel Catagory for where all the tempory channel will be creates",
    dev: false
}
