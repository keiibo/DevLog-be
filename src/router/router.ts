import express from "express";
import healthCheck from "../controller/healthCheck";
import project from "../controller/project";
import ticket from "../controller/ticket";
import user from "../controller/user";

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
router.get("/project/all/:userId", project.getAllProject);

/**
 * POST: チケットの新規作成
 */
router.post("/tickets", ticket.postTicket);

/**
 * GET; チケット全件取得
 */
router.get("/tickets", ticket.getAllTickets);
/**
 * GET; チケット1件詳細取得
 */
router.get("/tickets/:ticketId", ticket.getTicket);
/**
 * PUT; チケットの更新
 */
router.put("/tickets/:ticketId", ticket.updateTicket);
/**
 * DELETE: チケットの更新
 */
router.delete("/tickets/:ticketId", ticket.deleteTicket);
/**
 * POST: ユーザー新規作成
 */
router.post("/user", user.createUser);
/**
 * POST: ユーザーログイン
 */
router.post("/login", user.loginUser);

export default router;
