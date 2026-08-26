import express from "express";
import cors from "cors";
import analyticsRouter from "./routes/analytics";
import eventsRouter from "./routes/events";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/analytics", analyticsRouter);
app.use("/api/events", eventsRouter);

export default app;
