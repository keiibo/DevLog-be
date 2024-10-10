// updateTickets.js
import { connectDB } from '../util.mjs';

/**
 * 2024/10/8 TicketコレクションのmileStoneをオブジェクトからuuidのstringに一括で変更するスクリプト
 */
async function updateTickets() {
  try {
    const { database, client } = await connectDB();
    const collections = await database.listCollections();
    console.log('存在するコレクション:', collections);

    const tickets = database.collection('Tickets');

    // // フィルタ条件：mileStone がオブジェクトであり、mileStone.uuid が存在するドキュメント
    const filter = { 'mileStone.uuid': { $exists: true } };
    const data = await tickets.find(filter).toArray();

    // データをログに出力
    console.log(data);

    // // 更新内容：mileStoneUuid フィールドを設定し、mileStone フィールドを削除
    // const update = [
    //   {
    //     $set: {
    //       mileStoneUuid: '$mileStone.uuid'
    //     }
    //   },
    //   {
    //     $unset: 'mileStone'
    //   }
    // ];

    // // // ドキュメントを一括で更新します
    // const result = await tickets.updateMany(filter, update);

    // console.log(`更新されたチケットの数: ${result.modifiedCount}`);

    console.log('更新が完了しました。');
    await client.close();
  } catch (err) {
    console.error('エラーが発生しました:', err);
  }
}

updateTickets();
