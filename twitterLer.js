const { getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const googleTTS = require('google-tts-api');
const { buscarTweetAleatorio } = require('./twitter');

const CONTAS_TWITTER = ['JFortulino', 'marco_burigo', 'gabrieunargass', 'monarkbanido', 'CazeTVOficial', 'pedrocertezas'];

function escolherContaAleatoria() {
    const i = Math.floor(Math.random() * CONTAS_TWITTER.length);
    return CONTAS_TWITTER[i];
}

async function lerTweetAleatorioEmVoz(guild, bearerToken) {
    const conexao = getVoiceConnection(guild.id);
    if (!conexao) return;

    const canal = guild.channels.cache.get(conexao.joinConfig.channelId);
    if (!canal) return;

    const username = escolherContaAleatoria();
    
    try {
        const tweet = await buscarTweetAleatorio(username, bearerToken);
        const vozes = ['pt', 'pt-BR', 'pt-PT', 'en-US'];
        const voz = vozes[Math.floor(Math.random() * vozes.length)];

        const url = googleTTS.getAudioUrl(tweet, {
            lang: voz,
            slow: false,
            host: 'https://translate.google.com',
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(url);

        player.play(resource);
        conexao.subscribe(player);

        console.log(`[${guild.name}] Falando tweet de @${username}: ${tweet}`);

        player.on(AudioPlayerStatus.Idle, () => {
            console.log(`[${guild.name}] Fim da leitura de @${username}`);
        });

    } catch (err) {
        console.error(`[${guild.name}] Erro ao ler tweet de @${username}:`, err.message || err);
    }
}

module.exports = { lerTweetAleatorioEmVoz };
