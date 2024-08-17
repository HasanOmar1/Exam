import express from "express";
import cors from "cors";
import dataRoute from "./routes/dataRouter.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import limiter from "./middlewares/rateLimiterMiddleware.js";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hasan-tolstoy-exam.netlify.app/",
    ],
  })
);
app.use(express.json());
app.use(helmet());
app.use(limiter);

app.use("/", dataRoute);

app.get("/", (req, res, next) => {
  res.send({
    welcome: `Welcome, to start using the api type this to the url`,
    endpoint: `/fetch-metadata?urls="The link you want to scrap"`,
    moreInfo: `You have to add atleast three urls query parameters`,
  });
});

app.use(errorHandler);

const port = process.env.PORT || 9999;
app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

export default app;
