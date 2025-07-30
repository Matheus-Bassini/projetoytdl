FROM node:18-bullseye

# Atualiza os repositórios, instala python3, pip, ffmpeg e dependências necessárias
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instala yt-dlp via pip
RUN pip3 install --no-cache-dir yt-dlp

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir downloads uploads

ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
