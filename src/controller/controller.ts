import express from "express";

const healthCheck = (req: express.Request, res: express.Response): void => {
  res.status(200).send("Health OK"); // ステータスコード200を明示的に設定
};

export default {
  healthCheck,
};
