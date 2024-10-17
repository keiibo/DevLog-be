import mongoose from 'mongoose';

/**
 * Templateモデルのスキーマ定義です。
 * @property {String} projectId プロジェクトID
 * @property {String} uuid  画面から設定される一意識別し
 * @property {String} title  タイトル
 * @property {String} content コンテンツ
 */
const templateSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    title: { type: String },
    content: { type: String, required: true }
  },
  { collection: 'Template' }
);

const Template = mongoose.model('Template', templateSchema);

export default Template;
