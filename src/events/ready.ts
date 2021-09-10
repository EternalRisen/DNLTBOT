/** ready event */

import { client } from '../common';
import { loadcommands } from '../commands';

client.on('ready', (c: any) => {
    loadcommands();
    console.log(`Online as ${c.user.tag}`);
});
