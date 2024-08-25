import express from "express";
import Category from "../../model/ticket/Category";

/**
 * チケットカテゴリの作成
 */
const syncCategories = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, categories } = req.body;

    if (!projectId || !Array.isArray(categories)) {
      return res
        .status(400)
        .send("プロジェクトIDとカテゴリ配列が正しく提供されていません");
    }

    // リクエストからカテゴリUUIDのリストを作成
    const requestedUuids = new Set(categories.map((category) => category.uuid));

    // データベースから現在のプロジェクトの全カテゴリを取得
    const currentCategories = await Category.find({ projectId });

    // リクエストに含まれないカテゴリをフィルタリング
    const categoriesToDelete = currentCategories.filter(
      (category) => !requestedUuids.has(category.uuid)
    );

    // 余分なカテゴリを削除
    if (categoriesToDelete.length > 0) {
      const deleteUuids = categoriesToDelete.map((category) => category.uuid);
      await Category.deleteMany({ uuid: { $in: deleteUuids } });
    }

    // 新規カテゴリをフィルタリングしてデータベースに追加
    const newCategories = categories.filter(
      (category) => !currentCategories.some((c) => c.uuid === category.uuid)
    );
    if (newCategories.length > 0) {
      await Category.insertMany(
        newCategories.map((category) => ({
          ...category,
          projectId,
        }))
      );
    }

    res.status(200).send({
      success: true,
      message: `更新されたカテゴリ数: ${newCategories.length}, 削除されたカテゴリ数: ${categoriesToDelete.length}`,
      projectId: projectId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "500" });
  }
};

/**
 * カテゴリ一覧の取得
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
  syncCategories,
  getCategories,
};
