import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User";

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
      return res.status(404).send("ユーザーが見つかりません。");
    }

    // パスワードの確認
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).send("パスワードが正しくありません。");
    }

    // ログイン成功
    res.status(200).send({
      userId: user.userId,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("サーバーエラーです。");
  }
};

export default { createUser, loginUser };
