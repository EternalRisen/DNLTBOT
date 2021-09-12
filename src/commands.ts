// basic setup for how commands will work

import Discord = require('discord.js');
import { client, prefix, toID } from './common';
import fs = require('fs');

export type Channel = Discord.TextChannel | Discord.ThreadChannel;

export interface Constructable<T> {
    new(message: Discord.Message): T;
    help(): string;
}

export interface Alias {
    [key: string]: string[];
}

export interface CMD {
    [key: string]: Constructable<Command> | Alias;
}

export abstract class Command {
    protected message: Discord.Message;
	protected cmd: string;
	protected args: string;
	protected author: Discord.User;
	protected channel: Channel;
	protected guild: Discord.Guild | null;
    public aliases: string[] = [];

    /** each command will need to do super(message) */
    constructor(message: Discord.Message) {
        this.message = message;
        const [cmd, ...args] = message.content.slice(prefix.length).split(' ');
        this.cmd = cmd;
        this.args = args.join(' ');
        this.author = message.author;
        this.channel = (message.channel as Channel);
        this.guild = message.guild;
        // for ease of access on help command
        this.aliases = [];
    }

    /**
     * Execute function
     * Used to run the command
     */
    public abstract execute(): Promise<Discord.Message | void>;

    /**
	 * Reply to the message that triggered this command.
	 * @param msg The message to reply with, returns if nothing
	 * @param channel The channel to reply in, defaults to channel used in
	 */
	protected reply(msg: string, channel?: Channel): Promise<Discord.Message> | void {
		if (!msg) return;
		if (!channel) channel = this.channel;
		return channel.send(msg);
    }

    static help(): string {
        return 'no help provided for this command'
    }

    protected async can(permission: string, user?: Discord.User, guild?: Discord.Guild) {
        if (!user) user = this.author;
        if (!guild && this.guild) guild = this.guild;
        const permissions = Object.keys(Discord.Permissions.FLAGS);
        const customPermissions = ['EVAL'];
        // see if permission exists
        if (!permissions.includes(permission) && !customPermissions.includes(permission)) throw new Error(`permission: ${permission} does not exist.`);

        // check custom permissions
        switch (permission) {
            case 'EVAL':
                if (process.env.DEVS?.split(',').map(toID).includes(toID(user.id))) {
                    return true
                } else return false;
        }

        // don't work in pms
        if (!guild) return false;

        const member = await guild.members.fetch(user);

        // automatically return true if the user is an admin or if they are the owner
        if (member.permissions.has('ADMINISTRATOR')) return true;
        if (toID(guild.ownerId) === toID(user.id)) return true;

        // see if permission exists
        if (!permissions.includes(permission)) throw new Error(`permission: ${permission} does not exist.`);

        return member.permissions.has((permission as Discord.PermissionResolvable));
    }

    protected sendCode(msg: string, channel?: Channel): Promise<Discord.Message> | void {
        console.log('test');
		if (msg === '') return;
		if (!channel) channel = this.channel;
        
        // handle long results
        if (msg.length > 1900) {
            let msgChunks = [];
            for (let i = 0, charsLength = msg.length; i < charsLength; i += 1900) {
                msgChunks.push(msg.substring(i, i + 1900));
            }
            for (let chunk of msgChunks) {
                return channel.send(`\`\`\`js\n${chunk}\n\`\`\``);
            }
        } else return channel.send(`\`\`\`js\n${msg}\n\`\`\``);
	}

    /** Handle other functions as needed */
}

export const commands = new Discord.Collection();

export let cmdlock = false;

/** Also load commands from here */
export function loadcommands() {
    cmdlock = true;
    const files = fs.readdirSync(`${__dirname}/commands`).filter(f => f.endsWith('.js'));
    for (const file of files) {
        const cmdmod: CMD = require(`${__dirname}/commands/${file}`);
        for (const cmd in cmdmod) {
            const mod = cmdmod[cmd];
            if (typeof mod === 'function') {
                commands.set(toID(cmd), mod);
            } /* else {
                /** alias? *\/
                for (const key in cmdmod) {
                    const aliases = cmdmod[key];
                    for (const alias of /** bully typescript *\/(aliases as any)) {
                        commands.set(toID(alias), key)
                    }
                }
            } */
        }
    }
    cmdlock = false;
}
