require('dotenv').config({ path: './token.env' });

const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const {
    joinVoiceChannel,
    getVoiceConnection
} = require('@discordjs/voice');

const { tocarAudioAleatorio } = require('./tocarAudio');
const { lerTweetAleatorioEmVoz } = require('./twitterLer');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Bot online como ${client.user.tag}`);

    agendarEntrada();
    agendarLeituraTweet();
    agendarSom();
});

function agendarEntrada() {
    const delay = Math.random() * 60 * 360 * 1000; // até 6 horas
    console.log(`Próxima verificação de entrada em ${(delay / 1000 / 60).toFixed(2)} minutos`);

    setTimeout(() => {
        client.guilds.cache.forEach(guild => {
            const conexao = getVoiceConnection(guild.id);
            if (conexao) return;

            const canais = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice);
            const canalOcupado = canais.find(c => c.members.size > 0);

            if (canalOcupado) {
                console.log(`[${guild.name}] Entrando no canal ${canalOcupado.name}`);
                joinVoiceChannel({
                    channelId: canalOcupado.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator
                });
            }
        });

        agendarEntrada(); // reprograma
    }, delay);
}

function agendarLeituraTweet() {
    const delay = Math.random() * 60 * 45 * 1000; // até 45 minutos
    console.log(`Próxima leitura de tweet em ${(delay / 1000 / 60).toFixed(2)} minutos`);

    setTimeout(() => {
        client.guilds.cache.forEach(guild => {
            lerTweetAleatorioEmVoz(guild, process.env.TWITTER_BEARER);
        });

        agendarLeituraTweet(); // reprograma
    }, delay);
}

function agendarSom() {
    const delay = Math.random() * 60 * 60 * 1000; // até 1 hora
    console.log(`Próximo som aleatório em ${(delay / 1000 / 60).toFixed(2)} minutos`);

    setTimeout(() => {
        client.guilds.cache.forEach(guild => {
            const conexao = getVoiceConnection(guild.id);
            if (conexao) {
                tocarAudioAleatorio(conexao);
            }
        });

        agendarSom(); // reprograma
    }, delay);
}

client.on('voiceStateUpdate', (oldState, newState) => {
    // Verifica se alguém saiu de um canal de voz
    if (oldState.channelId && oldState.channel) {
        const canal = oldState.channel;
        const guild = canal.guild;

        const botAindaNaCall = canal.members.has(client.user.id);
        if (!botAindaNaCall) return;

        const humanosNoCanal = canal.members.filter(m => !m.user.bot);

        if (humanosNoCanal.size === 0) {
            const conexao = getVoiceConnection(guild.id);
            if (conexao) {
                conexao.destroy();
                console.log(`Saí do canal "${canal.name}" pois ficou vazio.`);
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
