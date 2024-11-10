import express from 'express';
import Template from '../../model/ticket/Template';

/**
 * 指定されたプロジェクトIDに関連するテンプレートを取得する関数
 */
const getTemplates = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params;

    // プロジェクトIDが存在しない場合は400エラーレスポンスを返す
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'プロジェクトIDが必要です。'
      });
    }

    // プロジェクトIDに関連するマイルストーンをデータベースから取得
    const templates = await Template.find({ projectId });

    // 成功レスポンスでテンプレート一覧を返す
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: '500 内部サーバーエラー'
    });
  }
};

/**
 * 新しいテンプレートを作成する関数
 */
const createTemplate = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params;
    const { uuid, title, content } = req.body;

    // 必須フィールドが存在しない場合は400エラーレスポンスを返す
    if (!projectId || !uuid || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'プロジェクトID、UUID、タイトル、内容は必須です。'
      });
    }

    // 新しいテンプレートを作成
    const newTemplate = new Template({
      projectId,
      uuid,
      title,
      content
    });

    // データベースに保存
    await newTemplate.save();

    // 成功レスポンスで作成されたテンプレートを返す
    res.status(201).json({
      success: true,
      message: 'テンプレートが正常に作成されました。',
      template: newTemplate
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({
      success: false,
      message: '500 内部サーバーエラー'
    });
  }
};

/**
 * テンプレートをプロジェクトIDとUUIDを元に更新する関数
 */
const updateTemplate = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params; // パスから projectId を取得
    const { uuid, title, content } = req.body; // ボディから uuid, title, content を取得

    // projectId または uuid が存在しない場合は400エラーレスポンスを返す
    if (!projectId || !uuid) {
      return res.status(400).json({
        success: false,
        message: 'プロジェクトIDとUUIDが必要です。'
      });
    }

    // 更新するフィールドが存在しない場合は400エラーレスポンスを返す
    if (!title && !content) {
      return res.status(400).json({
        success: false,
        message: '更新する内容が必要です。'
      });
    }

    // projectIdとuuidに基づいてテンプレートを検索し、更新
    const updatedTemplate = await Template.findOneAndUpdate(
      { projectId, uuid }, // 検索条件としてprojectIdとuuidを使用
      { title, content }, // 更新内容
      { new: true } // 新しい値を返すオプション
    );

    // テンプレートが見つからない場合、404エラーレスポンスを返す
    if (!updatedTemplate) {
      return res.status(404).json({
        success: false,
        message:
          '指定されたプロジェクトIDまたはUUIDに関連するテンプレートが見つかりませんでした。'
      });
    }

    // 成功レスポンスで更新されたテンプレートを返す
    res.status(200).json({
      success: true,
      message: 'テンプレートが正常に更新されました。',
      template: updatedTemplate
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({
      success: false,
      message: '500 内部サーバーエラー'
    });
  }
};

export default { getTemplates, createTemplate, updateTemplate };
