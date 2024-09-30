import mongoose from 'mongoose';

/**
 * MileStoneモデルのスキーマ定義です。
 * @typedef {Object} MileStone
 * @property {String} uuid  画面から設定される一意識別し
 * @property {String} version バージョン
 * @property {String} name  カテゴリ名
 */
const mileStoneSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    version: { type: String, required: true },
    projectId: { type: String, required: true }
  },
  { collection: 'MileStone' }
);

const MileStone = mongoose.model('MileStone', mileStoneSchema);

export default MileStone;
