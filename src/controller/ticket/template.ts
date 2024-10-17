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

export default { getTemplates };
