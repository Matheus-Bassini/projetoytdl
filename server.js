// server.js
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // onde está seu frontend

// Pasta de downloads temporários
const downloadDir = path.join(__dirname, "downloads");
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

app.post("/api/download", (req, res) => {
  const { url, platform, format } = req.body;
  const fileId = `video_${Date.now()}`;
  const extension = format === "audio" ? "mp3" : "mp4";
  const outputPath = path.join(downloadDir, `${fileId}.${extension}`);

  let command = `yt-dlp -o "${outputPath}" `;
  if (format === "audio") command += "-x --audio-format mp3 ";
  if (platform === "instagram" || platform === "facebook") command += "--force-generic-extractor ";
  command += `"${url}"`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(stderr);
      return res.status(500).send("Erro ao processar download.");
    }

    res.download(outputPath, () => {
      fs.unlink(outputPath, () => {}); // remove após envio
    });
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
