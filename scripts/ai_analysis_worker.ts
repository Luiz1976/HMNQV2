import { db } from "@/lib/db";

/**
 * AI Analysis Worker
 *
 * This script searches for TestResult records marked with metadata.status === "ai_analysis_ready"
 * and triggers the real AI analysis pipeline (/api/ai/analyze) for each record.
 *
 * Usage (development):
 *   npx ts-node app/scripts/ai_analysis_worker.ts
 *
 * In production you can schedule this via a cron-job or serverless scheduler every few minutes.
 */
async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  console.info("[AI-Worker] Starting worker…", new Date().toISOString());

  // 1. Locate test results awaiting AI analysis
  const pendingResults = await db.testResult.findMany({
    where: {
      metadata: {
        path: "status",
        equals: "ai_analysis_ready",
      },
    },
    include: {
      test: true,
      user: true,
    },
  });

  if (!pendingResults.length) {
    console.info("[AI-Worker] No pending results. Exiting.");
    return;
  }

  console.info(`[AI-Worker] Found ${pendingResults.length} pending result(s).`);

  for (const result of pendingResults) {
    try {
      console.info(`\n[AI-Worker] Processing TestResult ${result.id} for user ${result.userId}`);

      const res = await fetch(`${baseUrl}/api/ai/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testResultId: result.id }),
      });

      if (!res.ok) {
        console.error(`[AI-Worker] Failed analysis for ${result.id}: ${res.status} ${res.statusText}`);
        continue;
      }

      console.info(`[AI-Worker] Analysis completed for ${result.id}`);

      // Update metadata status to ai_analysis_complete
      await db.testResult.update({
        where: { id: result.id },
        data: {
          metadata: {
            ...(result.metadata as object || {}),
            status: "ai_analysis_complete",
            aiAnalyzedAt: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      console.error(`[AI-Worker] Error while processing ${result.id}:`, error);
    }
  }

  console.info("[AI-Worker] Worker finished.");
  await db.$disconnect();
}

main().catch((err) => {
  console.error("[AI-Worker] Fatal error:", err);
  db.$disconnect();
  process.exit(1);
});