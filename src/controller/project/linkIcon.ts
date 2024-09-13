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

/**
 * 特定のリンクアイコンを削除する
 */
const deleteLinkIcon = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { projectId, uuid } = req.body;

    // 指定された projectId のエントリを取得
    // const linkIconEntry = await LinkIcon.findOne({ projectId: projectId });
    // 指定された uuid のリンクアイコンを削除
    const result = await LinkIcon.updateOne(
      { projectId },
      { $pull: { linkIconList: { uuid } } }
    );
    // if (!linkIconEntry) {
    //   res.status(404).send({
    //     message: '指定された projectId のリンクアイコンが見つかりません。'
    //   });
    //   return;
    // }
    // linkIconList から指定された uuid を持つアイコンを削除
    // const removedIcon = linkIconEntry.linkIconList.find(
    //   (icon) => icon.uuid === uuid
    // );
    // if (!removedIcon) {
    //   res.status(404).send({
    //     message: '指定された uuid のリンクアイコンが見つかりません。'
    //   });
    //   return;
    // }

    // removedIcon.remove();

    // // 更新を保存
    // await linkIconEntry.save();

    res.status(200).send({
      message: 'リンクアイコンを正常に削除しました。'
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

export default {
  createOrUpdateLinkIconList,
  deleteLinkIcon
};
