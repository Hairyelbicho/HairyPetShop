// utils/server.js
const express = require("express");
const app = express();

app.use(express.json({ limit: "2mb" }));

app.get("/status", (_req, res) => {
  res.json({
    ok: true,
    service: "Hairy Utils",
    time: new Date().toISOString(),
    url: "https://n8n-hairypetshop.onrender.com",
  });
});

// Echo para pruebas de conexión externa
app.post("/echo", (req, res) => {
  res.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    headers: req.headers,
    body: req.body,
  });
});

// Mock de webhook Syncee
app.post("/syncee/mock-webhook", (req, res) => {
  // Podrías reenviar al webhook real de n8n si lo deseas
  // fetch("https://n8n-hairypetshop.onrender.com/webhook/syncee", { method: "POST", body: JSON.stringify(req.body), headers: {'Content-Type': 'application/json'}})
  res.json({
    ok: true,
    event: "syncee.mock",
    payload: req.body || {},
  });
});

// Healthcheck
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

const port = process.env.UTILS_PORT || 8080;
app.listen(port, () => {
  console.log(`[utils] listening on :${port}`);
});
