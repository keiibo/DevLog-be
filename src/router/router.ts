import express from "express";
import healthCheck from "../controller/healthCheck";
import project from "../controller/project";

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
 * プロジェクト一覧取得
 */
router.get("/project", project.getAllProject);

export default router;
