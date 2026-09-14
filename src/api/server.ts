import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env" : ".env.local" });

import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "@/api/routes";
import { errorHandler, notFoundHandler } from "@/api/middleware/errorHandler";

function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );
  app.use(express.json({ limit: "1mb" }));

  app.use("/api", routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

const app = createApp();

// Only start listening when this file is run directly (e.g. `tsx src/api/server.ts`),
// not when imported by tests via supertest.
if (require.main === module) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY environment variable is not set. Set it in .env.local.");
    process.exit(1);
  }

  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Legal AI backend listening on port ${port}`);
  });
}

export default app;
