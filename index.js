// npm requirements
const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const fs = require('fs');

const botconfig = require('./settings.json');
const Database = require('./filesys.js');


// Add commands
console.log('loading commands...');
client.commands = new Discord.Collection();

const TagManager = require('./tags.js');
let tagmngr = new TagManager('./tags.json');
tagmngr.Open();

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

client.on('guildCreate', (g) => {
    console.log(`joining ${g.name}`);
});
client.on('guildDelete', (g) => {
    console.log(`leaving ${g.name}`);
});

// Callbacks
client.on('ready', () => {
    console.log('\'ready\' event executed. discord-compiler has started');
});

client.on('message', message => {
    if (!message.content.startsWith(botconfig.prefix)) return;
    if (message.author.bot) return;

    // strip !
    message.content = message.content.substring(botconfig.prefix.length);
    let args = message.content.split(" ").join('\n').split('\n');
    let commandfile = client.commands.get(args[0]);
    if (commandfile) {
        if(commandfile.help.dev && message.author.id != botconfig.owner_id)
            return;

        commandfile.run(client, message, args, botconfig.prefix);
    }
});

client.on('error', console.error);

// Pump them callbacks
client.login(botconfig.token);
