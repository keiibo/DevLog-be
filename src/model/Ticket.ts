import mongoose from "mongoose";

// Enum 定義
const LabelColorTypes = {
  WHITE: "white",
  LIGHT_BLUE: "lightBlue",
  BLUE: "blue",
  RED: "red",
};

const Priorities = {
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
};

const Statuses = {
  NOT_STARTED: "notStarted",
  UNDER_CONSTRUCTION: "underConstruction",
  COMPLETED: "completed",
};

/**
 * Ticketモデルのスキーマ定義です。
 * @typedef {Object} Ticket
 * @property {Number} _id チケットのID
 * @property {String} projectId プロジェクトID
 * @property {String} labelColorType ラベルの色タイプ
 * @property {String} title タイトル
 * @property {Boolean} isDeletable 削除可能かどうか
 * @property {String} limitStartYm 開始期限 (オプション)
 * @property {String} limitEndYm 終了期限 (オプション)
 * @property {String} priority 優先度
 * @property {String} status ステータス
 */
const ticketSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    projectId: { type: String, required: true },
    labelColorType: {
      type: String,
      required: true,
      enum: Object.values(LabelColorTypes),
    },
    title: { type: String, required: true },
    isDeletable: { type: Boolean, required: true },
    limitStartYm: { type: String },
    limitEndYm: { type: String },
    priority: { type: String, required: true, enum: Object.values(Priorities) },
    status: { type: String, required: true, enum: Object.values(Statuses) },
  },
  { collection: "Tickets" }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
