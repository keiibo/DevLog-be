import express from "express";
import jwt from "jsonwebtoken";

const JWT_S = process.env.JWT_SECRET;
/**
 * 認証ミドルウェア
 */
export const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // トークンがない場合は認証エラー

  console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    console.log("===============");

    console.log(decoded);
    console.log("===============");
    res.locals.user = decoded;
    next();
  } catch (error) {
    res.status(403).send({ message: "Invalid Token" });
  }
};
