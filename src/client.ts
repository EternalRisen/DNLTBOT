import { client } from './common';
import fs = require('fs');

/** get events going */
const files = fs.readdirSync(`${__dirname}/events`).filter((f: any) => f.endsWith('.js'));
for (const file of files) {
    require(`${__dirname}/events/${file}`);
}

client.login((process.env.TOKEN as string));
