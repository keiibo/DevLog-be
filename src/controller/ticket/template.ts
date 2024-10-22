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

    // テンプレート一覧が見つからない場合、404エラーレスポンスを返す
    if (templates.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          '指定されたプロジェクトIDに関連するマイルストーンは見つかりませんでした。'
      });
    }

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

export default { getTemplates, createTemplate };
