import { Router } from "express";
import { fetchData } from "../controller/dataController.js";
import limiter from "../middlewares/rateLimiterMiddleware.js";

const router = Router();

router.get(`/fetch-metadata`, fetchData);

export default router;
