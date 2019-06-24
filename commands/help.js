const fs = require('fs');
const discord = require('discord.js');

// Dynamic Help command

module.exports.run = async (client, message, args, prefix) => {
    // Setup embed
    const helpEmbed = new discord.RichEmbed()
    .setTitle("Command Help list")
    .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f5a5.png")
    .setColor("#00FFFF")

    // Gather all command names and description
    let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

    // Iterate through commandfiles for every file
    for (const file of commandFiles) {
      const command = require(__dirname.replace("commands",`commands\\${file}`)); // Get info about each file

      // Pushes the Feild name (command name) Description of the command into embed
      if (command.help.dev == false || message.member.hasPermission('ADMINISTRATOR')){helpEmbed.addField(command.help.name,`	\`\`\`${command.help.description}\`\`\` `,false)}

    }

    // Send callback
    message.reply( helpEmbed ).then().catch(console.error)
}

module.exports.help = {
    name: "help",
    description: "displays all commands",
    dev: false
}
