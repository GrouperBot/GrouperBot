import './env';
import { join } from 'path';
import GrouperClient from './structures/GrouperClient';
import { initialize } from './database';

initialize({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

const client = new GrouperClient({
    disableEveryone: true,
    developers: process.env.DEVELOPERS,
});

// TODO: Call to handler to load advertisements and tags

client.commands.registerCommandsIn(join(__dirname, 'commands'));
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
