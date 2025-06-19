import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

//Routes import
import userRouter from "./routes/user.routes";
import jobRouter from "./routes/job.routes";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);

export default app;