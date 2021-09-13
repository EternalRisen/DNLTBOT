/** eval command - for devs only uwu */

import Discord = require('discord.js');
// unused vars are to eval the variables
import { Command, commands, cmdlock } from '../lib/commands';
import { client, prefix } from '../lib/common';
import { inspect } from 'util';

export class Eval extends Command {
    constructor(message: Discord.Message) {
        super(message);
        this.aliases = ['e'];
    }

    async execute(): Promise<void | Discord.Message> {
        try {
            this.args.replace('```js', '');
        } catch {
            // do nothing
        }

        try {
            this.args.replace('```', '');
        } catch {
            // do nothing
        }

        // for the sake of hopefully being able to eval the variables
        const bot = client;
        const pfx = prefix;
        const cmds = commands;
        const cmdslock = cmdlock;

        if (await !this.can('EVAL')) {
            return await this.reply('You cannot eval, sorry :(')
        }
        let result: any = '';
        try {
            result = eval(this.args);
            result = inspect(result);
            if (result === '') result = '""';
        } catch (err: any) {
            result = `'an error occured'\n${err.toString()}`
        }
        await this.sendCode(result);
    }

    static help(): string {
        return 'eval, runs js code.  only owners may use this!';
    }
}
