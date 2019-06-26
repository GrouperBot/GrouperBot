// npm requirements
require('dotenv').config();

import GrouperClient from './structures/GrouperClient';
import { initialize } from './database';
import { readdir } from 'fs';

initialize(process.env.DATABASE_FILE);

const client = new GrouperClient({
    disableEveryone: true,
});

// Add commands
console.log('loading commands...');

readdir('./commands/', (err, files) => {
    if (err)
        console.log(err);

    //TODO: Have all commands implement an abstract class similar to Commando's implementation

    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length == 0)
        return

    jsfiles.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} command has been loaded!`);
        client.commands.set(props.help.name, props);
    });
});

// callbacks

client.on('guildCreate', (g) => {
    console.log(`joining ${g.name}`);
});
client.on('guildDelete', (g) => {
    console.log(`leaving ${g.name}`);
});

client.on('ready', () => {
    console.log('\'ready\' event executed. lfg bot has started');
});

client.on('message', message => {
    if (!message.content.startsWith(process.env.BOT_PREFIX)) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    //TODO: Argument class, pass along with other data if necessary

    // strip !
    message.content = message.content.substring(process.env.BOT_PREFIX.length);

    let args = message.content.split(" ").join('\n').split('\n');

    let commandfile = client.commands.get(args[0]);

    if (commandfile) {
        if(commandfile.help.dev) {
            let found = botconfig.developers.find(function(element) {
                return message.author.id == element;
            });
            if (found == null)
                return;
        }

        commandfile.run(client, message, args, process.env.BOT_PREFIX, tagmngr, db);
    }
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
