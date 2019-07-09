import GrouperCommand from '../structures/GrouperCommand.js';
import GrouperMessage from '../structures/GrouperMessage';
import ResponseBuilder from '../util/ResponseBuilder.js';
import { Constants } from 'discord.js';

export default class RequestCommand extends GrouperCommand{

  constructor(client) {
      super(client, {
          name: 'request',
          description: 'Sends a request to respected owner to add new tags.',
      });
  }

  /**
   * Runner for help command
   *
   * @param {GrouperMessage} grouper
   * @returns {RichEmbed}
   */
  async run(grouper){

    const response = new ResponseBuilder();
    const author = grouper.message.author
    const sArgs = grouper.getArgs();

    // Make sure that theirs a tag and reason
    if (sArgs.length < 2) {
        return this.help(grouper);
    }

    const tag = sArgs.shift()

    // Makes sure people arent requesting already implemented tags
    if (this.client.tags.has(tag)) {
        response
            .setTitle('Tag already exist')
            .setState(false)
            .setDescription(`Tag "${tag}" already exist within the database`)

        return grouper.dispatch(response);
    }

    const reason = sArgs.join(" ")

    // Setup Responce
    response
    .setTitle('TAG REQUEST')
        .addField(`**${tag}**`, `\`\`\`${reason}\`\`\``)
        .setColor('GREEN')
        .setFooter(`Requested by ${author.username}#${author.discriminator}`)

    return this.dispatch(author,grouper,response)
  }

  /**
   * Utility/helper for this command
   *
   * @param {GrouperMessage} grouper
   */
  async help(grouper) {
      const response = new ResponseBuilder();

      response
          .setTitle('Command Usage')
          .setDescription(`*${this.description}*`)
          .addHelpField('Add a tag', `${this.toString()} \`<tagName>\` \`<reasons>\``)
          .isUsage()

      grouper.dispatch(response);
  }

  /**
   * Utility/helper for this command
   *
   * @param {MessageAuthor} author
   * @param {GrouperMessage} grouper
   * @param {RichEmbed} content
   */
  dispatch(author,grouper,content) {
        let requestChannel = this.client.requestChannel

        // If request channel hasnt been set then change content output to be sutable error msg.
        if (!requestChannel){
          content = new RichEmbed()
            .setThumbnail("https://i.imgur.com/Lqnb8NT.png")
            .setTitle('Uh Oh!')
            .setColor('RED')
            .setDescription('**Sorry but no tag request channel was set by the bot owner!**')
            .setFooter(`Requested by ${author.username}#${author.discriminator}`)
          requestChannel = grouper.message.channel
        }

        // Sharding will pose problem later in, so let's skip cache all together (Master brings out more abstraction)
        content = content._apiTransform();

        this.client.rest.makeRequest('post', Constants.Endpoints.Channel(requestChannel).messages, true, {
            content: '',
            embed: content,
        });
    }

}
