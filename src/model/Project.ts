// models/Project.ts

import mongoose from "mongoose";

/**
 * Projectモデルのスキーマ定義です。
 * @typedef {Object} Project
 * @property {String} name プロジェクト名
 * @property { mongoose.Schema.Types.ObjectId} userId ユーザーId
 * @property {String} projectId: プロジェクトID
 * @property {String} detail 詳細
 * @property {Date} limitDate プロジェクトの期限日
 */
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    detail: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    projectId: { type: String, required: true },
    limitDate: { type: Date, required: true },
  },
  { collection: "Projects" }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
