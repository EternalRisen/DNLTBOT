/** ready event */

import { client } from '../lib/common';
import { loadcommands } from '../lib/commands';

client.on('ready', (c: any) => {
    loadcommands();
    console.log(`Online as ${c.user.tag}`);
});
