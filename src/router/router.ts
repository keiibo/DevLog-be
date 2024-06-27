import express from "express";
import controller from "../controller/controller";

const router = express.Router();

router.get("/health-check", controller.healthCheck);

export default router;
