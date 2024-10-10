import express from 'express';
import MileStone from '../../model/ticket/MileStone';
import Ticket from '../../model/ticket/Ticket';

/**
 * 指定されたプロジェクトIDに関連するマイルストーンを取得する関数
 */
const getMileStones = async (req: express.Request, res: express.Response) => {
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
    const mileStones = await MileStone.find({ projectId });

    // マイルストーンが見つからない場合、404エラーレスポンスを返す
    if (mileStones.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          '指定されたプロジェクトIDに関連するマイルストーンは見つかりませんでした。'
      });
    }

    // 成功レスポンスでマイルストーンを返す
    res.status(200).json(mileStones);
  } catch (error) {
    console.error('Error fetching mileStones:', error);
    res.status(500).json({
      success: false,
      message: '500 内部サーバーエラー'
    });
  }
};

/**
 * マイルストーンの作成
 */
const createMileStone = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, mileStone, updateTicketIds } = req.body;

    // リクエストのバリデーション
    if (!projectId || !mileStone || !Array.isArray(updateTicketIds)) {
      return res
        .status(400)
        .send(
          'プロジェクトID、マイルストーン、更新チケットIDリストが正しく提供されていません'
        );
    }

    // マイルストーンが既存か確認
    const existingMileStone = await MileStone.findOne({ uuid: mileStone.uuid });

    if (existingMileStone) {
      // 既存のマイルストーンを更新
      existingMileStone.name = mileStone.name;
      existingMileStone.version = mileStone.version;
      await existingMileStone.save();
    } else {
      // 新規のマイルストーンを作成
      await MileStone.create({
        ...mileStone,
        projectId
      });
    }

    // 関連するチケットを更新
    if (updateTicketIds.length > 0) {
      await Ticket.updateMany(
        { ticketId: { $in: updateTicketIds } },
        {
          mileStoneUuid: mileStone.uuid
        }
      );
    }

    res.status(200).send({
      success: true,
      message: `マイルストーンが作成・更新され、${updateTicketIds.length} 件のチケットが更新されました`,
      projectId
    });
  } catch (error) {
    console.error('Error syncing milestone:', error);
    res
      .status(500)
      .send({ success: false, message: '500 Internal Server Error' });
  }
};

/**
 * マイルストーンの更新
 */
const updateMileStones = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const mileStonesToUpdate = req.body;

    // バリデーションチェック
    if (!Array.isArray(mileStonesToUpdate) || mileStonesToUpdate.length === 0) {
      return res.status(400).json({
        success: false,
        message: '更新するマイルストーンの配列が必要です。'
      });
    }
    // リクエストからのマイルストーンUUIDのリストを作成
    const requestUuids = mileStonesToUpdate.map((mileStone) => mileStone.uuid);
    console.log(requestUuids);

    // 既存のマイルストーンのUUIDのリストを取得
    const existingMileStones = await MileStone.find({
      projectId: req.params.projectId
    });
    console.log(existingMileStones);

    const existingUuids = existingMileStones.map((mileStone) => mileStone.uuid);
    console.log(existingUuids);

    // 削除対象のUUIDを特定（リクエストに含まれていないUUID）
    const uuidsToDelete = existingUuids.filter(
      (uuid) => !requestUuids.includes(uuid)
    );
    console.log(uuidsToDelete);

    // 削除対象のマイルストーンを削除
    if (uuidsToDelete.length > 0) {
      await MileStone.deleteMany({ uuid: { $in: uuidsToDelete } });

      // 削除されたマイルストーンを参照しているチケットの mileStoneUuid を null に更新
      await Ticket.updateMany(
        { mileStoneUuid: { $in: uuidsToDelete } },
        { $set: { mileStoneUuid: null } }
      );
    }

    // 更新処理
    const updatePromises = mileStonesToUpdate.map(async (mileStone) => {
      const { uuid, name, version } = mileStone;

      // 個別のバリデーション
      if (!uuid || !name || !version) {
        throw new Error('UUID、名前、バージョンが必要です。');
      }

      // マイルストーンの存在確認
      const existingMileStone = await MileStone.findOne({ uuid });

      if (existingMileStone) {
        // 既存のマイルストーンを更新
        const updatedMileStone = await MileStone.findOneAndUpdate(
          { uuid },
          { name, version },
          { new: true } // 更新後のドキュメントを取得
        );

        return updatedMileStone;
      } else {
        // 新しいマイルストーンを作成
        const newMileStone = new MileStone({
          uuid,
          name,
          version,
          projectId: req.params.projectId
        });
        await newMileStone.save();
        return newMileStone;
      }
    });

    // すべての更新が完了するまで待機
    const updatedMileStones = await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: 'マイルストーンが更新されました。',
      mileStones: updatedMileStones
    });
  } catch (error) {
    console.error('Error updating milestones:', error);
    res.status(500).json({
      success: false,
      message: '500 内部サーバーエラー'
    });
  }
};
export default { createMileStone, getMileStones, updateMileStones };
