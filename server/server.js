import express from "express";
import cors from "cors";

const app = express();

app.use(cors());

const port = 9999;

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
