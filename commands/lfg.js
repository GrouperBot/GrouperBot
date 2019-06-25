const fs = require('fs');
const discord = require('discord.js');
const database = require(__dirname.replace("commands","filesys.js"));

module.exports.run = async (client, message, args, prefix) => {

  args.shift(); // remove first element of array (command name)

  // Gets Data

  let db = new database()

  db.Open()


  // length of arg 0 means show ads
  if (args.length == 0) {
    // TODO: Make a way to append data to the json
    return
  } else {
    // Searching Algorithm of finding tags
    if ( args[0].toLowerCase() != "new" ) {
      // Setup embed
      const adsEmbed = new discord.RichEmbed()
      .setThumbnail("https://images.emojiterra.com/twitter/v12/512px/1f4cb.png")
      .setColor( "#964B00" )


      // Nested loop to iterate through all the json data to find tag
      for ( tag of Object.keys( db.data ) ) {

        // Found Tag
        if (tag.toLowerCase() == args[0].toLowerCase()){

          adsEmbed.setTitle( `Ads Board - ${tag.toUpperCase()}` )

          // Inserts to embed
          for ( ad of db.data[tag] ) {adsEmbed.addField( ad["author"],`	\`\`\`\nlooking for ${ad["playernum"]} players \n\n${ad["description"]}\`\`\` `,false )}

          return message.reply( adsEmbed ) // Found tag doesnt need to go though the rest of the json
        }
      }

      message.reply( `Sorry I couldn't find the tag " ${args[0]} " ` )
    } else {

      args.shift() // remove "new" from args

      questions = ["What tag would you like","Number of players needed","Description"]
      userReplies = [message.author.username]

      // filter = m => m.author.id == message.author.id;


      for (question of questions){

        message.channel.send(question)

        const msgs = await message.channel.awaitMessages(function(msg){

          if (msg.author.id == client.id){
            userReplies.push(msg.content)
          }

        }, {time : 10000})
      }

      console.log(userReplies)



    }



  }






}


module.exports.help = {
    name: "lfg",
    description: "lfg command",
    dev: false
}
