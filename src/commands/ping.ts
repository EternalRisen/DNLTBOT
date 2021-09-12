/** ping command uwu */

import Discord = require('discord.js');
import { Command, Alias } from '../commands';
import { client } from '../common';

export const alias: Alias = {
    ping: ['p']
};

export class Ping extends Command {
    constructor(message: Discord.Message) {
        super(message);
        //this.aliases = alias.ping;
    }

    async execute(): Promise<void | Discord.Message> {
        await this.reply(`UwU\nPong!\nthe ping is ${client.ws.ping}`);
    }

    static help(): string {
        return 'ping, sees if the bot is responsive and gives an estimate on how long it takes for the API to respond';
    }
}
