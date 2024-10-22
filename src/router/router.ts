import express from 'express';
import healthCheck from '../controller/healthCheck';
import project from '../controller/project/project';
import ticket from '../controller/ticket/ticket';
import detail from '../controller/project/linkIcon';
import user from '../controller/user';
import { authenticateToken } from '../middleWare/auth';
import category from '../controller/ticket/category';
import note from '../controller/note/note';
import mileStone from '../controller/ticket/mileStone';
import template from '../controller/ticket/template';

const router = express.Router();
/**
 * ヘルスチェック
 */
router.get('/health-check', healthCheck.getHealthCheck);
/**
 * POST: ユーザー新規作成
 */
router.post('/user', user.createUser);

/**
 * POST: ユーザーログイン
 */
router.post('/login', user.loginUser);

// ここから下のルートには認証が適用されます
router.use(authenticateToken);

/**
 * POST: プロジェクト新規作成
 */
router.post('/project', project.postProject);

/**
 * GET: プロジェクト詳細取得
 */
router.get('/project/:projectId', project.getProject);

/**
 * GET:プロジェクト一覧取得
 */
router.get('/project/all/:userId', project.getAllProject);
/**
 * PATCH:プロジェクト更新
 */
router.patch('/project/:projectId', project.updateProjectPartial);

/**
 * POST: チケットの新規作成
 */
router.post('/tickets', ticket.postTicket);

/**
 * GET; チケット全件取得
 */
router.get('/tickets', ticket.getAllTickets);
/**
 * GET; チケット1件詳細取得
 */
router.get('/tickets/:ticketId', ticket.getTicket);
/**
 * PUT; チケットの更新
 */
router.put('/tickets/:ticketId', ticket.updateTicket);
/**
 * DELETE: チケットの更新
 */
router.delete('/tickets/:ticketId', ticket.deleteTicket);
/**
 * POST: チケットカテゴリの作成
 */
router.post('/tickets/category', category.syncCategories);
/**
 * GET: チケットカテゴリの一覧取得
 */
router.get('/tickets/category/:projectId', category.getCategories);
/**
 * GET: マイルストーンの一覧取得
 */
router.get('/tickets/mileStone/:projectId', mileStone.getMileStones);
/**
 * POST: マイルストーンの作成
 */
router.post('/tickets/mileStone', mileStone.createMileStone);
/**
 * PUT: マイルストーンの一括更新
 */
router.put('/mileStones/update/:projectId', mileStone.updateMileStones);
/**
 * GET: テンプレートの取得
 */
router.get('/tickets/template/:projectId', template.getTemplates);
/**
 * POST: テンプレートの取得
 */
router.post('/tickets/template/:projectId', template.createTemplate);
/**
 * POST: リンクアイコンリストの作成
 */
router.post('/detail/linkIcon', detail.createOrUpdateLinkIconList);
/**
 * DELETE: 特定のリンクアイコンの削除
 */
router.delete('/detail/linkIcon/:projectId/:uuid', detail.deleteLinkIcon);
/**
 * GET:ノートの全取得
 *
 */
router.get('/note/:projectId', note.getNotes);
/**
 * GET:ノートの詳細取得
 */
router.get('/note/:projectId/:uuid', note.getNoteByUuid);
/**
 * POST: ノートの新規作成
 */
router.post('/note/create/:projectId', note.postNote);
/**
 * PUT: ノートの更新
 */
router.put('/note/update/:projectId', note.updateNote);
/**
 * DELETE: ノートの削除
 */
router.delete('/note/:projectId/:uuid', note.deleteNote);
/**
 * GET: Me
 */
router.get('/me', user.getUser);

export default router;
