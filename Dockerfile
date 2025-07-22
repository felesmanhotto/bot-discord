# Usa imagem oficial do Node.js
FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos para dentro da imagem
COPY . .

# Instala dependências com Yarn e ignora opcionais como opus
RUN yarn install --ignore-optional

# Comando para iniciar o bot
CMD ["node", "index.js"]
