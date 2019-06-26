const discord = require('discord.js');

// Dynamic Help command

module.exports.run = async (client, message, args, prefix, tagmngr) => {
  let action = args[1];
  let tag = args[2];

  if (args.length != 3) {
    const embed = new discord.RichEmbed()
    .setTitle("Invalid usage!")
    .setThumbnail("https://images.emojiterra.com/google/android-oreo/128px/1f4bd.png")
    .setColor("#FF0000")
    .setDescription('You botched it')
    message.channel.sendMessage(embed).then().catch(console.log);
    return;
  }  
  if (action == 'add') {
    tagmngr.AddTag(tag);
  }
  else if (action == 'remove') {
    tagmngr.RemoveTag(tag);
    action = 'remov';
  }
  else {
    const embed = new discord.RichEmbed()
    .setTitle("Tag Manager")
    .setThumbnail("https://images.emojiterra.com/google/android-oreo/128px/1f4bd.png")
    .setColor("#b8bbc1")
    .setDescription(`Unknown action \`${action}\`! Did you mean \`add\` or \`remove\`?`)
    message.channel.sendMessage(embed).then().catch(console.log);
    return;
  }

  const embed = new discord.RichEmbed()
  .setTitle("Tag Manager")
  .setThumbnail("https://images.emojiterra.com/google/android-oreo/128px/1f4bd.png")
  .setColor("#b8bbc1")
  .setDescription(`Tag \`${tag}\` has been successfully ${action}ed`)
  message.channel.sendMessage(embed).then().catch(console.log);
}

module.exports.help = {
    name: "tag",
    description: "tag removal or additions",
    dev: true
}
