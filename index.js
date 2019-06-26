// npm requirements
require('dotenv').config();

import GrouperClient from './structures/GrouperClient';
import { initialize } from './database';

initialize(process.env.DATABASE_FILE);

const client = new GrouperClient({
    disableEveryone: true,
    developers: process.env.DEVELOPERS,
});

// TODO: Call to handler to load advertisements and tags

client.commands.registerCommandsIn(path.join(__dirname, 'commands'));
client.hookRouter();

client.on('guildCreate', (g) => {
    console.log(`joining ${g.name}`);
});
client.on('guildDelete', (g) => {
    console.log(`leaving ${g.name}`);
});

client.on('ready', () => {
    console.log('\'ready\' event executed. lfg bot has started');
});

client.on('error', console.error);

client.login(process.env.BOT_TOKEN);
