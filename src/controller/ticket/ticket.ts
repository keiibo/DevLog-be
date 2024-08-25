import express from "express";
import Ticket from "../../model/ticket/Ticket";
import { getNextSequence } from "../../db/count";
import Category from "../../model/ticket/Category";

/**
 * チケットの新規作成
 */
const postTicket = async (req: express.Request, res: express.Response) => {
  try {
    const {
      projectId,
      labelColorType,
      title,
      detail,
      isDeletable,
      limitStartYm,
      limitEndYm,
      priority,
      status,
    } = req.body;

    const sequenceNumber = await getNextSequence(projectId);
    const ticketId = `${projectId}-${sequenceNumber}`;

    const newTicket = new Ticket({
      // _id を指定せず、自動生成される ObjectId を利用
      ticketId, // カスタムフィールドとして ticketId を使用
      projectId,
      labelColorType,
      title,
      detail,
      isDeletable,
      limitStartYm,
      limitEndYm,
      priority,
      status,
    });
    await newTicket.save();
    res.status(201).send(newTicket);
  } catch (error: any) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

/**
 * チケットの更新
 */
const updateTicket = async (req: express.Request, res: express.Response) => {
  try {
    const { ticketId } = req.params;
    const updateData = req.body;

    const updatedTicket = await Ticket.findOneAndUpdate(
      { ticketId: ticketId },
      updateData,
      { new: true } // 更新後のドキュメントを返す
    );
    if (!updatedTicket) {
      return res.status(404).send("指定されたチケットIDが見つかりません");
    }
    res.status(200).send(updatedTicket);
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * projectIdに紐づくチケット一覧の取得
 */
const getAllTickets = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).send("プロジェクトIDが正しくありません");
    }
    const tickets = await Ticket.find({ projectId: projectId });
    res.status(200).send(tickets);
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * チケットIDをもとにチケットの詳細情報を取得する
 */
const getTicket = async (req: express.Request, res: express.Response) => {
  try {
    const { ticketId } = req.params;
    if (!ticketId) {
      return res.status(400).send("チケットIDが正しくありません");
    }
    const ticket = await Ticket.findOne({ ticketId: ticketId });
    res.status(200).send(ticket);
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

/**
 * チケットの削除
 */
const deleteTicket = async (req: express.Request, res: express.Response) => {
  try {
    const { ticketId } = req.params;
    if (!ticketId) {
      return res.status(400).send("チケットIDが正しくありません");
    }
    const ticket = await Ticket.findOneAndDelete({ ticketId: ticketId });
    res.status(200).send(ticket);
  } catch (error: any) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

export default {
  postTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
};
