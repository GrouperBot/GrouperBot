const fs = require('fs');
const discord = require('discord.js');

// Dynamic Help command

module.exports.run = async (client, message, args, prefix) => {
    // Setup embed
    const helpEmbed = new discord.RichEmbed()
    .setTitle("Command Help list")
    .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f5a5.png")
    .setColor("#00FFFF")

    // Iterate through commandfiles for every file
    client.commands.forEach(element => {
      let name = element.help.name;
      let desc = element.help.description;
      let dev = element.help.dev;

      // Pushes the Feild name (command name) Description of the command into embed
      if (!dev) {
        helpEmbed.addField(name,`	\`\`\`${desc}\`\`\` `,false)
      }
    });

    // Send callback
    message.reply( helpEmbed ).then().catch(console.error)
}

module.exports.help = {
    name: "help",
    description: "displays all commands",
    dev: false
}
