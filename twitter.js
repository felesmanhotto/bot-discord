const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function buscarTweetAleatorio(username, bearerToken) {
    try {
        const userRes = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
            headers: { Authorization: `Bearer ${bearerToken}` }
        });

        if (!userRes.ok) throw new Error('Erro ao buscar usuário');

        const userData = await userRes.json();
        const userId = userData.data.id;

        const tweetsRes = await fetch(`https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=text`, {
            headers: { Authorization: `Bearer ${bearerToken}` }
        });

        if (!tweetsRes.ok) throw new Error('Erro ao buscar tweets');

        const tweets = await tweetsRes.json();
        const lista = tweets.data;

        if (!lista || lista.length === 0) throw new Error('Nenhum tweet encontrado');

        const aleatorio = lista[Math.floor(Math.random() * lista.length)];

        return aleatorio.text;

    } catch (err) {
        console.error(`Erro interno em buscarTweetAleatorio(${username}):`, err.message || err);
        throw err; // ainda propaga para ser tratado por quem chamou
    }
}

module.exports = { buscarTweetAleatorio };
