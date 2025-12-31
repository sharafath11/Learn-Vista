import cron from "node-cron";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import { IKmatService } from "../../core/interfaces/services/user/IKmatService";
import { logger } from "../logger";

export const startKmatCron = () => {
    // Run every 5 minutes
    cron.schedule("*/5 * * * *", async () => {
        logger.info("Running KMAT Daily Generation Retry CRON...");
        try {
            const kmatService = container.get<IKmatService>(TYPES.KmatService);
            await kmatService.handleFailedGenerations();
            logger.info("KMAT CRON: Successfully processed failed generations.");
        } catch (error) {
            logger.error("KMAT CRON ERROR:", error);
        }
    });
};
