import mongoose from "mongoose";

/**
 * Userモデルのスキーマ定義です。
 * @typedef {Object} User
 * @property {String} userId ユーザーID
 * @property {String} username ユーザーネーム
 * @property {String} email メールアドレス
 * @property {String} passwordHash パスワードのハッシュ
 * @property {Date} createdAt アカウントの作成日時
 * @property {Date} updatedAt アカウントの最終更新日時
 * @property {Date} lastLogin 最後のログイン日時
 */
const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
  },
  { collection: "Users" } // MongoDBのコレクション名を指定
);

const User = mongoose.model("User", userSchema);

export default User;
