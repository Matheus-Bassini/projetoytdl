FROM node:18-alpine

# Instalar dependências de sistema para yt-dlp (como ffmpeg e python)
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    bash \
  && pip3 install --no-cache-dir yt-dlp

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
