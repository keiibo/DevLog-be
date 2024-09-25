import express from 'express';
import { getNextSequence } from '../../db/count'; // シーケンス番号を取得する関数を仮定
import Note from '../../model/note/Note';

/**
 * プロジェクト内のすべてのノートを取得
 */
const getNotes = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params; // URLパラメータからprojectIdを取得

    // 指定されたプロジェクトIDに紐づく全てのノートを取得
    const notes = await Note.find({ projectId: projectId });

    if (notes.length === 0) {
      return res
        .status(404)
        .send({ message: '指定されたプロジェクトIDにノートが存在しません' });
    }

    res.status(200).send(notes);
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * 特定のノートを取得
 */
const getNoteByUuid = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, uuid } = req.params; // URLパラメータからprojectIdとnoteIdを取得

    // 指定されたプロジェクトIDとnoteIdに一致するノートを取得
    const note = await Note.findOne({ projectId: projectId, uuid: uuid });

    if (!note) {
      return res
        .status(404)
        .send({ message: '指定されたノートが見つかりません' });
    }

    res.status(200).send(note);
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

/**
 * ノートの新規作成
 */
const postNote = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params; // URLからprojectIdを取得
    const { uuid, icon, title, body } = req.body;

    const newNote = new Note({
      // _id は自動生成される ObjectId を利用
      projectId,
      uuid,
      icon,
      title,
      createdAt: new Date(), // 作成日時を現在の日時に設定
      updatedAt: new Date(), // 更新日時も現在の日時に設定
      body
    });

    await newNote.save();
    res.status(201).send(newNote);
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
};

/**
 * ノートの更新
 */
const updateNote = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.params; // URLからprojectIdを取得
    const { uuid, icon, title, body } = req.body; // 更新データをリクエストボディから取得

    const updatedNote = await Note.findOneAndUpdate(
      { projectId: projectId, uuid: uuid }, // projectIdとnoteIdでノートを特定
      {
        uuid,
        icon,
        title,
        body,
        updatedAt: new Date() // 更新日時を現在の日時に設定
      },
      { new: true } // 更新後のドキュメントを返す
    );

    if (!updatedNote) {
      return res
        .status(404)
        .send({ message: '指定されたノートが見つかりません' });
    }

    res.status(200).send(updatedNote);
  } catch (error: any) {
    res.status(500).send({ message: error.message });
  }
};

export default {
  getNotes,
  postNote,
  updateNote,
  getNoteByUuid
};
