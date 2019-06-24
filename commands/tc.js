filename = __dirname.replace("commands","tc.json")
const { RichEmbed } = require('discord.js')

module.exports.run = async (client, message, args, prefix) => {

  const DiscordConfig = require(filename);

  // Check if stc has been set
  if (DiscordConfig[message.guild.id] == null) {message.reply("Sorry but no Temp Channel Category has been set. too set TCC just do `!stc CategoryID`");return}

  message.delete(5000) // delete msg in 5 seconds

  // create Text Channel
  var textChannel

  message.guild.createChannel(`${message.author.username} Text Channel`,'text',[{
    id : message.author.id,
    allow: ["VIEW_CHANNEL","MANAGE_MESSAGES","MANAGE_ROLES","MANAGE_CHANNELS"],
    deny: ["CREATE_INSTANT_INVITE"]
  },{
    id : message.guild.id,
    deny : ["VIEW_CHANNEL"]
  }]).then(function(channel){

    // Put Text channel into temp category
    channel.setParent(DiscordConfig[message.guild.id]);textChannel = channel

    // Setup Embed

    const embed = new RichEmbed()
    .setTitle(`Welcome to your channel ${message.author.username}`)
    .setColor("#F0E68C")
    .addField("Permissions Given?","View Channel,Manage Messages,Manage Permissions,Manage Channel,Connect")
    .addField("Permissions Denied?","Only Create Instant Invite")
    .addField("Why am I the only that can see or connect both my channels?","Because by default your the only one that has permissions to see your channels\nYou can change this by hovering over your channel and clicking on the gear wheel and going to permission and adding your friends or roles **(you will need to do this on both channels)**")
    .addField("Good things too know!","Both Channels will delete after about 10 to 15 seconds if zero user are in the voice channel")

    channel.send(embed)
  })
  .catch(function(err){console.log(err)})

  // Store Text channel so we can delete later

  // Create Voice Channel

  message.guild.createChannel(`${message.author.username} Voice Channel`,'voice',[{
    id : message.author.id,
    allow: ["VIEW_CHANNEL","MANAGE_MESSAGES","MANAGE_ROLES","MANAGE_CHANNELS","CONNECT"],
    deny: ["CREATE_INSTANT_INVITE"]
  },{
    id : message.guild.id,
    allow : ["VIEW_CHANNEL"],
    deny : ["CONNECT"]
  }]).then(function(channel){

    // Set Channel to Temp Category
    channel.setParent(DiscordConfig[message.guild.id])

    // Check if people
    let check = 0
    var updater = client.setInterval(function(){
      if (channel.members.size != 0) { check = 0; return }
      if (channel.members.size == 0 && check == 2){
        // Delete both channels if not already deleted possible

        if (!channel.deleted){channel.delete()}
        if (!textChannel.deleted){textChannel.delete()}

        // Stop Interval
        clearInterval(updater)
      } else {
        check += 1
      }

    },5000)
  })
  .catch(function(err){console.log(err)})

}

module.exports.help = {
    name: "tc",
    description: "Creates a Tempory channel",
    dev: false
}
