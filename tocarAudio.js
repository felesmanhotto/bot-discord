const { createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
const fs = require('fs');

function tocarAudioAleatorio(connection) {
    try {
        const pasta = path.join(__dirname, 'audios');
        const arquivos = fs.readdirSync(pasta).filter(arquivo =>
            arquivo.endsWith('.mp3') || arquivo.endsWith('.wav') || arquivo.endsWith('.ogg')
        );

        if (arquivos.length === 0) {
            console.warn('Nenhum áudio encontrado na pasta /audios.');
            return;
        }

        const aleatorio = arquivos[Math.floor(Math.random() * arquivos.length)];
        const caminho = path.join(pasta, aleatorio);

        const player = createAudioPlayer();
        const resource = createAudioResource(caminho);

        player.play(resource);
        connection.subscribe(player);

        console.log(`Tocando: ${aleatorio}`);

        player.on(AudioPlayerStatus.Idle, () => {
            console.log(`Finalizado: ${aleatorio}`);
        });

        player.on('error', err => {
            console.error('Erro ao tocar áudio:', err.message || err);
        });

    } catch (err) {
        console.error('Erro interno em tocarAudioAleatorio:', err.message || err);
    }
}

module.exports = { tocarAudioAleatorio };
