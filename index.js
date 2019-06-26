// npm requirements
const Discord = require('discord.js');
const fs = require('fs');
const botconfig = require('./settings.json');
const TagManager = require('./tags.js');
const Database = require('./filesys.js');

const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();

const tagmngr = new TagManager('./tags.json');
const db = new Database()

tagmngr.Open();
db.Open()

// Add commands
console.log('loading commands...');

fs.readdir('./commands/', (err, files) => {
    if (err)
        console.log(err);

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
    if (!message.content.startsWith(botconfig.prefix)) return;
    if (message.author.bot) return;

    // strip !
    message.content = message.content.substring(botconfig.prefix.length);
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

        commandfile.run(client, message, args, botconfig.prefix, tagmngr, db);
    }
});

client.on('error', console.error);
client.login(botconfig.token);
