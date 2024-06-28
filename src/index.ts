import express from "express";
import router from "./router/router";
import connectDB from "./db/db";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();
if (!process.env.DB_URI) {
  process.exit(1);
}
connectDB(process.env.DB_URI);

app.get("/", (req, res) => {
  res.send("Connection Success");
});
app.use("/api", router);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
