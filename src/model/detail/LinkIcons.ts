import mongoose, { Schema } from 'mongoose';

// リンクアイコンのサブドキュメントスキーマ
const linkIconSchema = new Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    iconType: { type: String, required: true },
    uuid: { type: String, required: true }
  },
  {
    _id: false // サブドキュメントには独自の_idを生成しない
  }
);

// LinkIconのメインスキーマ
const linkIconMainSchema = new Schema(
  {
    projectId: {
      type: String,
      required: true
    },
    linkIconList: [linkIconSchema] // リンクアイコンのリスト
  },
  {
    collection: 'LinkIcons' // MongoDBでのコレクション名
  }
);

const LinkIcon = mongoose.model('LinkIcon', linkIconMainSchema);

export default LinkIcon;
