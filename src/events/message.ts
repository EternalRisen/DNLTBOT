/** message event */

import { client, prefix, toID } from '../common';
import { cmdlock, commands, Constructable, Command, loadcommands } from '../commands';

client.on('messageCreate', (m: any) => void (async msg => {
    /** do nothing if bot */
    if (msg.author.bot) return;

    /** do nothing if no prefix was used */
    if(!msg.content.startsWith(prefix)) return;

    /** if commands aren't loaded yet, don't do anything */
    if (cmdlock) return msg.reply('Commands aren\'t loaded yet, wait a minute before trying again.');

    const CmdID = toID(msg.content.slice(prefix.length).split(' ')[0]);
    let command = commands.get(CmdID);
    if (typeof command === 'string') command = commands.get(command);
    /** error if it's an alias */
    if (typeof command === 'string') throw new Error(`Alias ${CmdID} not found`);
    if (!command) return msg.reply('command not found');

    const cmd = new (command as Constructable<Command>)(msg);
    await cmd.execute();
})(m));
