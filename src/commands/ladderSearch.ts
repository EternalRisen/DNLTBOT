/** laddersearch command = searches the ladder for users in the top 500 of a metagame */

import Discord = require('discord.js');
import { Command } from '../lib/commands';
import { searchLadder } from '../lib/showdownladderAPI';

export class LadderSearch extends Command {
    constructor(message: Discord.Message) {
        super(message)
        this.aliases = ['ls', 'ladder'];
    }

    async execute() {
        // we will make this more complex later
        let args: string[] | string = this.args.split(' ');
        const pfx = args[0];
        args.shift();
        args = args.join(' ');
        const meta = args

        const items: any = await searchLadder(pfx, meta);

        let sendItem = 'LADDER RESULTS';
        let i = 0;

        for (let item of items) {
            i++
            sendItem += `
            ${i}: '${item.userid}'
            elo: ${item.elo}
            gxe: ${item.gxe}
            wins: ${item.w}
            losses: ${item.l}
            `
        }

        await this.sendCode(sendItem);
    }
}