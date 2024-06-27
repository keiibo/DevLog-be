import express from "express";
import router from "./router/router";
import connectDB from "./db/db";

const app = express();
connectDB();

app.get("/", (req, res) => {
  res.send("Connection Success");
});
app.use("/api", router);
app.listen(4001, () => {
  console.log("The server is listening on port 4001");
});
