import express from "express";
import Category from "../../model/ticket/Category";

/**
 * チケットカテゴリの作成
 */
const createCategories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { projectId, categories } = req.body;
    console.log(projectId, categories);

    if (!projectId || !Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .send("プロジェクトIDとカテゴリ配列が正しく提供されていません");
    }

    // すべてのカテゴリのUUIDを取得
    const uuids = categories.map((category) => category.uuid);

    // 既存のカテゴリを検索
    const existingCategories = await Category.find({ uuid: { $in: uuids } });
    const existingUuids = new Set(
      existingCategories.map((category) => category.uuid)
    );

    // 既存のUUIDを除外した新規カテゴリのみをフィルタリング
    const newCategories = categories
      .filter((category) => !existingUuids.has(category.uuid))
      .map((category) => ({
        ...category,
        projectId, // projectId を各カテゴリに追加
      }));

    // 新規カテゴリがない場合は早期リターン
    if (newCategories.length === 0) {
      return res.status(204).send("新規登録するカテゴリはありません");
    }

    // 新規カテゴリをデータベースに保存
    await Category.insertMany(newCategories);
    res.status(201).send({
      success: true,
      message: `${newCategories.length}件のカテゴリを登録しました`,
      projectId: projectId,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

/**
 * カテゴリ一覧の取得
 */
/**
 * 特定のプロジェクトIDに関連する全カテゴリを取得し、整形して返す
 */
const getCategories = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params; // URLからprojectIdを取得
    if (!projectId) {
      return res.status(400).send("プロジェクトIDが提供されていません");
    }

    // projectIdに一致するカテゴリをデータベースから検索
    const categories = await Category.find({ projectId: projectId });

    // レスポンスデータの整形
    const responseData = {
      projectId: projectId,
      categories: categories.map((category) => ({
        uuid: category.uuid,
        name: category.name,
      })),
    };

    // 成功した場合、整形したデータを返す
    res.status(200).json(responseData);
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

export default {
  createCategories,
  getCategories,
};
