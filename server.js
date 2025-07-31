const express = require('express');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Definindo o caminho absoluto do index.html para debug
const indexPath = path.join(__dirname, 'public', 'index.html');
console.log('Tentando servir arquivo:', indexPath);

// Rota raiz serve o index.html
app.get('/', (req, res) => {
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Erro ao enviar index.html:', err);
      res.status(500).send('Erro ao carregar página.');
    }
  });
});

// Rota para download via yt-dlp
app.post('/api/download', async (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: 'URL ou formato ausente.' });
  }

  const isAudio = format === 'audio';
  const isVideo = format === 'video';
  const isBoth = format === 'both';

  const baseCmd = `yt-dlp -o - "${url}"`;

  let formatOption = '';
  if (isAudio) formatOption = '-f bestaudio';
  else if (isVideo) formatOption = '-f bestvideo';
  else formatOption = '-f bestvideo+bestaudio';

  res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
  res.setHeader('Content-Type', 'video/mp4');

  const finalCmd = `${baseCmd} ${formatOption}`;

  const process = exec(finalCmd, { maxBuffer: 1024 * 1024 * 100 });

  process.stdout.pipe(res);
  process.stderr.on('data', (data) => {
    console.error('yt-dlp error:', data.toString());
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
