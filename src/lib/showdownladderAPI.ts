import got from 'got';

/**
 * @param pfx Optional.  searches for users in the toplist of the ladder (top 500) users who's username either matches or contains the string in this parameter
 * @param meta Optional (not implemented yet).  bases the search on whichever metagame exists, defaults to gen8anythinggoes (Galar AG) if it's not provided, or if the request doesn't resolve with a 200 code.
 */
export async function searchLadder(pfx: string, meta: string) {
    let res = await got(`https://pokemonshowdown.com/ladder/gen8anythinggoes.json`);
    /**try {
        res = await got(`https://pokemonshowdown.com/ladder/${meta}.json`);
    } catch {
        res = await got('https://pokemonshowdown.com/ladder/gen8anythinggoes.json');
    }*/

    let ITEMS = JSON.parse(res.body);
    let items = [];
    if (pfx) {
        for (const user of ITEMS.toplist) {
            if (user.userid.includes(pfx)) items.push(user);
        }
    } else {
        for (const user of ITEMS.toplist) {
            items.push(user);
        }
    }

    return items;
}