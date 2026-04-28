import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import serviceRequestsRouter from "./serviceRequests";
import messagesRouter from "./messages";
import contactsRouter from "./contacts";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portfolioRouter);
router.use(serviceRequestsRouter);
router.use(messagesRouter);
router.use(contactsRouter);
router.use(paymentsRouter);
router.use(dashboardRouter);

export default router;
