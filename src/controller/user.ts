import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User";

/**
 * ユーザーの新規作成
 */
const postUser = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, userName, email, password } = req.body;

    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      userId,
      userName,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ユーザーをデータベースに保存
    await newUser.save();

    // ユーザー情報をレスポンスとして返す（パスワードハッシュを除く）
    res.status(201).send({
      userId: newUser.userId,
      userName: newUser.userName,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("400エラーです");
  }
};

export default { postUser };
