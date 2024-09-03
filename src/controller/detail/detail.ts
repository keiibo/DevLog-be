import express from 'express';
import LinkIcon from '../../model/detail/LinkIcons';

/**
 * リンクアイコンリストを更新する
 */
const createOrUpdateLinkIconList = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { projectId, linkIconList } = req.body;
    // findOneAndUpdate を使用して、ドキュメントを検索し、存在すれば更新、なければ新規作成します。
    const updatedLinkIcon = await LinkIcon.findOneAndUpdate(
      { projectId }, // 検索条件
      { projectId, linkIconList }, // 更新内容
      { new: true, upsert: true, runValidators: true } // オプション
    );
    res.status(201).send({
      message: 'Link icon entry updated or created successfully.',
      data: updatedLinkIcon
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

export default {
  createOrUpdateLinkIconList
};
