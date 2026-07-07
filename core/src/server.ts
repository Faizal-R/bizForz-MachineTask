import "reflect-metadata";
import './di/inversify.config'
import app from "./app";
import connectDB from "./config/db";
import { EnvConfig } from "./config/env";

const PORT = EnvConfig.PORT

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectDB();

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