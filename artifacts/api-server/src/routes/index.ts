import { Router, type IRouter } from "express";
import healthRouter from "./health";
import signupsRouter from "./signups";
import authRouter from "./auth";
import communityRouter from "./community";

const router: IRouter = Router();

router.use(healthRouter);
router.use(signupsRouter);
router.use(authRouter);
router.use(communityRouter);

export default router;
