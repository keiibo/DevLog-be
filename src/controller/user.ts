import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User";
import Project from "../model/Project";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_S = process.env.JWT_SECRET;

/**
 * ユーザーの新規作成
 */
const createUser = async (req: express.Request, res: express.Response) => {
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

/**
 * ユーザーの取得
 */
const getUser = async (req: express.Request, res: express.Response) => {
  try {
    console.log(res.locals.user);

    const loginUser = await User.findOne({ userId: res.locals.user.userId });
    if (!loginUser) {
      return res.status(404).send("User not found");
    }
    // ログイン成功時
    // userIdに紐づくプロジェクトを取得する
    const projects = await Project.find({ userId: res.locals.user._id });

    // ユーザー情報から必要なデータのみを抽出
    const userData = {
      userId: loginUser.userId,
      userName: loginUser.userName,
      email: loginUser.email,
      projectIds: projects.map((project) => {
        return project?.projectId;
      }),
    };

    // 循環参照がない形でレスポンスを送信
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * ユーザーのログイン
 */
const loginUser = async (req: express.Request, res: express.Response) => {
  try {
    const { identifier, password } = req.body; // identifierはuserIdまたはemail

    // ユーザー識別子がメールアドレスかどうかを判別
    const isEmail = identifier.includes("@");

    // ユーザーを検索（メールアドレスかユーザーIDのどちらかで検索）
    let query = isEmail ? { email: identifier } : { userId: identifier };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).send("ユーザーまたはパスワードが不明。");
    }

    // パスワードの確認
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).send("ユーザーまたはパスワードが不明");
    }

    // トークンの発行
    const token = jwt.sign(
      { _id: user._id, userId: user.userId, email: user.email },
      JWT_S || "", // トークンを安全に保持するための秘密鍵
      { expiresIn: "1h" } // トークンの有効期限
    );

    // ログイン成功時
    // userIdに紐づくプロジェクトを取得する
    const projects = await Project.find({ userId: user._id });

    res.status(200).send({
      token: token,
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      projectIds: projects.map((project) => {
        return project?.projectId;
      }),
    });
  } catch (error) {
    res.status(500).send("サーバーエラーです。");
  }
};

export default { createUser, loginUser, getUser };
