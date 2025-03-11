import express from "express";
import "reflect-metadata";

const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
