import express from "express";
import healthCheck from "../controller/healthCheck";
import project from "../controller/project";
import ticket from "../controller/ticket";

const router = express.Router();

/**
 * ヘルスチェック
 */
router.get("/health-check", healthCheck.getHealthCheck);

/**
 * POST: プロジェクト新規作成
 */
router.post("/project", project.postProject);

/**
 * GET: プロジェクト詳細取得
 */
router.get("/project/:projectId", project.getProject);

/**
 * GET:プロジェクト一覧取得
 */
router.get("/project", project.getAllProject);

/**
 * POST: チケットの新規作成
 */
router.post("/tickets", ticket.postTicket);

/**
 * GET; チケット全件取得
 */
router.get("/tickets", ticket.getAllTickets);

export default router;
