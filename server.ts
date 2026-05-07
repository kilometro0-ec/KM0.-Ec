import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Store connected SSE clients
  let clients: any[] = [];

  // SSE Endpoint
  app.get("/api/notifications/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on("close", () => {
      clients = clients.filter(c => c.id !== clientId);
    });

    // Send initial "connected" message
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);
  });

  // Example trigger endpoint to send a notification to all clients
  app.post("/api/notifications/trigger", express.json(), (req, res) => {
    const notification = req.body;
    clients.forEach(c => {
      c.res.write(`data: ${JSON.stringify(notification)}\n\n`);
    });
    res.json({ success: true, clientsNotified: clients.length });
  });

  // Simple auto-ticker for demo
  setInterval(() => {
    if (clients.length > 0 && Math.random() > 0.8) {
      const demoNews = {
        id: Date.now(),
        type: 'news_alert',
        title: '¡Alerta de Tráfico!',
        content: 'Retraso de 15 minutos en el sector centro debido a obras viales.',
        variant: 'warning'
      };
      clients.forEach(c => {
        c.res.write(`data: ${JSON.stringify(demoNews)}\n\n`);
      });
    }
  }, 15000);

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LogiDash Server running at http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
