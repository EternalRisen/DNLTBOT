import Discord = require('discord.js');

const intents = Discord.Intents;

/** export variables */
export const client = new Discord.Client({intents: [intents.FLAGS.GUILDS, intents.FLAGS.GUILD_MESSAGES, intents.FLAGS.GUILD_BANS, intents.FLAGS.GUILD_MEMBERS, intents.FLAGS.GUILD_MESSAGE_REACTIONS]});
export const prefix = (process.env.PREFIX as string);

type ID = '' | string & {__isID: true};

export function toID(text: any): ID {
    if (text && text.id) return text.id;
    if (typeof text !== 'string' && typeof text !== 'number') return '';
    return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '') as ID;
}
