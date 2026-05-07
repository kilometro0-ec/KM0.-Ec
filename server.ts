import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { updateSheet } from "./server/googleSheets.ts";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Store connected SSE clients
  let clients: any[] = [];

  // Google Sheets Sync Endpoints
  const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

  app.post("/api/sync/orders", async (req, res) => {
    try {
      const orders = req.body;
      const values = [
        ['ID', 'Tracking', 'Cliente', 'Dirección', 'Estado', 'Monto', 'Fecha Creación', 'Pago'],
        ...orders.map((o: any) => [
          o.id, o.trackingNumber, o.customerName, o.deliveryAddress, o.status, o.amount, o.createdAt, o.paymentStatus
        ])
      ];

      await updateSheet(SPREADSHEET_ID!, 'Pedidos!A1', values);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sync/users", async (req, res) => {
    try {
      const users = req.body;
      const values = [
        ['Nombre', 'Email', 'Rol', 'Estado'],
        ...users.map((u: any) => [
          u.name, u.email, u.role, u.status || 'Activo'
        ])
      ];

      await updateSheet(SPREADSHEET_ID!, 'Usuarios!A1', values);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sync/inventory", async (req, res) => {
    try {
      const items = req.body;
      const values = [
        ['ID', 'Producto', 'Cantidad', 'Estado', 'Tienda', 'Enviado el'],
        ...items.map((i: any) => [
          i.id, i.productName, i.quantity, i.status, i.shopId || 'S/N', i.sentAt
        ])
      ];

      await updateSheet(SPREADSHEET_ID!, 'Inventario!A1', values);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sync/transactions", async (req, res) => {
    try {
      const txs = req.body;
      const values = [
        ['ID', 'Tipo', 'Cliente/Detalle', 'Monto', 'Fecha', 'Estado'],
        ...txs.map((t: any) => [
          t.id, t.type, t.customer, t.amount, t.date, t.status
        ])
      ];

      await updateSheet(SPREADSHEET_ID!, 'Pagos!A1', values);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sync/news", async (req, res) => {
    try {
      const news = req.body;
      const values = [
        ['ID', 'Título', 'Contenido', 'Tipo', 'Fecha', 'Autor'],
        ...news.map((item: any) => [
          item.id, item.title, item.content, item.type, item.date, item.author
        ])
      ];

      await updateSheet(SPREADSHEET_ID!, 'Novedades!A1', values);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

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
