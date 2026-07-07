import express, { Application } from "express";
import cors from "cors";
// import router from "./routes/routes";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware";
import helmet from "helmet";
import { EnvConfig } from "./config/env";
dotenv.config();

const app: Application = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(limiter)
app.use(
  cors({
    origin: EnvConfig.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(helmet());

// app.use('/api',router)

//  Health Check Route
app.get("/health", (req, res) => {
  res.json({ message: " API is running successfully!" });
});

app.use(errorMiddleware);

export default app;
