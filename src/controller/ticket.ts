import express from "express";
import Ticket from "../model/Ticket";
import { CounterType, getNextSequence } from "../db/count";

/**
 * チケットの新規作成
 */
const postTicket = async (req: express.Request, res: express.Response) => {
  try {
    const {
      projectId,
      labelColorType,
      title,
      isDeletable,
      limitStartYm,
      limitEndYm,
      priority,
      status,
    } = req.body;
    const newTicket = new Ticket({
      _id: await getNextSequence(CounterType.TICKET),
      projectId,
      labelColorType,
      title,
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

export default {
  postTicket,
  getAllTickets,
};
