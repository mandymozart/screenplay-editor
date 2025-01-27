import express from "express";
import path from "path";
import fs from "fs/promises";
import cors from "cors"; // Import CORS

const app = express();
const PORT = 3000;

// List of allowed origins (with ports)
const allowedOrigins = [
  "http://localhost:5173", // Example port
];

// CORS middleware configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Use the CORS middleware
app.use(cors(corsOptions));

async function startServer() {
  const distPath = path.resolve(process.cwd(), "./../app/dist");
  app.use(express.static(distPath));
  app.use(express.json());
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(distPath, "index.html"));
  });

  const apiDir = path.join(process.cwd(), "./src/api");
  const files = await fs.readdir(apiDir);

  files.forEach(async (file) => {
    if (file.endsWith(".js")) {
      const handler = (await import(`./api/${file}`)).default;
      app.use(`/api/${path.basename(file, ".js")}`, handler);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
