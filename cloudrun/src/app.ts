import express from "express";
import feedRoutes from "./routes/feeds";
import contentRoutes from "./routes/content";
import healthRouter from "./routes/health";
import notificationRouter from "./routes/batch/notifications";
import batchRoutes from "./routes/batch";
import { requireApiKey } from "./middleware/auth";

const app = express();

app.use(express.json());
app.use(requireApiKey);

app.use("/health", healthRouter);
app.use("/feeds", feedRoutes);
app.use("/content", contentRoutes);
app.use("/batch", batchRoutes);
app.use("/notifications", notificationRouter);

export default app;
