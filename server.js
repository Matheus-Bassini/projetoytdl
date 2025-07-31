const express = require('express');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // <- importante!

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
