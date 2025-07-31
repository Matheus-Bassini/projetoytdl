const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota principal para download
app.post("/api/download", (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({ error: "URL ou formato não fornecido." });
  }

  let ytDlpArgs = [];

  switch (format) {
    case "audio":
      ytDlpArgs = ["-f", "bestaudio", "--extract-audio", "--audio-format", "mp3", "-o", "-", url];
      res.setHeader("Content-Disposition", `attachment; filename="audio.mp3"`);
      res.setHeader("Content-Type", "audio/mpeg");
      break;

    case "video":
      ytDlpArgs = ["-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4", "-o", "-", url];
      res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
      res.setHeader("Content-Type", "video/mp4");
      break;

    case "both":
    default:
      ytDlpArgs = ["-f", "bestvideo+bestaudio", "--merge-output-format", "mp4", "-o", "-", url];
      res.setHeader("Content-Disposition", `attachment; filename="video.mp4"`);
      res.setHeader("Content-Type", "video/mp4");
      break;
  }

  const process = spawn("yt-dlp", ytDlpArgs);

  process.stdout.pipe(res);
  process.stderr.on("data", (data) => console.error(`[yt-dlp]: ${data}`));
  process.on("close", (code) => {
    if (code !== 0) {
      console.error(`yt-dlp process exited with code ${code}`);
      res.status(500).end();
    }
  });
});

// Rota de verificação simples (útil para o Render)
app.get("/", (req, res) => {
  res.send("Servidor está rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
