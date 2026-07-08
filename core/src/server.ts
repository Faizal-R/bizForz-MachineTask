import "reflect-metadata";
import './di/inversify.config.js'
import app from "./app.js";
import connectDB from "./config/db.js";
import { EnvConfig } from "./config/env.js";
import { seedPermissions } from "./config/seed.js";

const PORT = EnvConfig.PORT

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectDB();
    await seedPermissions();

    server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");

  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});