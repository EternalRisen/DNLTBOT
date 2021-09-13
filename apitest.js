const got = require('got');

async function uwu() {
    const res = await got('https://pokemonshowdown.com/ladder/gen8anythinggoes.json');
    const items = JSON.parse(res.body);
    for (let user of items.toplist) {
        if (user.userid.includes('dnlt')) console.log(user);
    }
}

uwu();
