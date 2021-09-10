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
    }

    async execute(): Promise<void | Discord.Message> {
        await this.reply(`UwU\nPong!\nthe ping is ${client.ws.ping}`);
    }

}