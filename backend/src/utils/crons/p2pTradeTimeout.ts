import { handleP2PTradeTimeouts } from "@b/api/(ext)/p2p/utils/p2p-trade-timeout";
import { logError } from "@b/utils/logger";
import { broadcastStatus, broadcastLog } from "@b/utils/crons/broadcast";

/**
 * Cron job to automatically expire P2P trades that have passed their expiration date
 * Run frequency: Every 5 minutes
 * Schedule: every 5 minutes
 */
export async function p2pTradeTimeout() {
  const cronName = "p2pTradeTimeout";
  const startTime = Date.now();

  try {
    broadcastStatus(cronName, "running");
    broadcastLog(cronName, "Starting P2P trade timeout job");

    // Call the trade timeout handler
    await handleP2PTradeTimeouts();

    const duration = Date.now() - startTime;
    broadcastStatus(cronName, "completed", { duration });
    broadcastLog(
      cronName,
      `P2P trade timeout job completed successfully`,
      "success"
    );

  } catch (error) {
    logError("cron_p2p_trade_timeout", error, __filename);
    broadcastStatus(cronName, "failed", {
      duration: Date.now() - startTime,
    });
    broadcastLog(
      cronName,
      `P2P trade timeout job failed: ${error.message}`,
      "error"
    );
    throw error;
  }
}

// Export for direct execution
export default p2pTradeTimeout;
