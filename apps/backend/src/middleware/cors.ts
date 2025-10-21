import cors from "cors";

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

const envOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const frontendUrl = process.env.FRONTEND_URL?.trim();
const allowedOrigins = [
  ...defaultOrigins,
  ...envOrigins,
  ...(frontendUrl ? [frontendUrl] : []),
];

export const corsMiddleware = cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});
