# Usa imagem oficial Node.js LTS
FROM node:18-slim

# Instala Python e pip (necessários para yt-dlp)
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg && rm -rf /var/lib/apt/lists/*

# Instala yt-dlp via pip
RUN pip3 install yt-dlp

# Cria diretório do app
WORKDIR /usr/src/app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala dependências Node.js
RUN npm install

# Copia todo o código para dentro do container
COPY . .

# Cria pastas downloads e uploads para o app funcionar
RUN mkdir downloads uploads

# Expõe a porta padrão (Render usa 10000+ por padrão, mas o Node pode usar 3000)
ENV PORT=3000
EXPOSE 3000

# Comando para iniciar seu app
CMD ["node", "server.js"]
