import './env';
import { join } from 'path';
import GrouperClient from './structures/GrouperClient';
import { initialize } from './database';
import log from './log';

const client = new GrouperClient({
    prefix: process.env.BOT_PREFIX,
    disableEveryone: true,
    developers: process.env.DEVELOPERS,
    adDuration: process.env.AD_DURATION,
}, {
    guild: process.env.SUPPORT_GUILD,
    channel: process.env.SUPPORT_CHANNEL,
});

initialize(client, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

client
    .hook()
    .commands.registerCommandsIn(join(__dirname, 'commands'))

client
    .on('guildCreate', g => {
        log.debug(`Client#guildCreate -> ${g.name}`);
    })
    .on('guildDelete', g => {
        log.debug(`Client#guildDelete -> ${g.name}`);
    })
    .on('ready', () => {
        log.info('Client#ready');
    })
    .on('databaseRetry', () => {
        log.warn('Client#databaseRetry');
    })
    .on('databaseInitialized', () => {
        log.info('Client#databaseInitialized');

        client.login(process.env.BOT_TOKEN);
    })
    .on('tagsLoaded', size => {
        log.info(`Client#tagsLoaded -> ${size}`);
    })
    .on('commandRegistered', command => {
        log.debug(`Client#commandRegistered -> ${command.name}`);
    })
    .on('error', e => {
        log.error(e);
    })
