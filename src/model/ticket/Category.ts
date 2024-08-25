import mongoose from 'mongoose';

/**
 * Categoryモデルのスキーマ定義です。
 * @typedef {Object} Category
 * @property {String} uuid  画面から設定される一意識別し
 * @property {String} name  カテゴリ名
 */
const categorySchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    projectId: { type: String, required: true }
  },
  { collection: 'Categories' }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
