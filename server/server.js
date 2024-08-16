import express from "express";
import cors from "cors";
import dataRoute from "./routes/dataRouter.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", dataRoute);

app.use(errorHandler);

const port = process.env.PORT || 9999;
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
