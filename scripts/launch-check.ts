import { db } from "../src/lib/db";
import {
  inspectPaymentSchema,
  type RawQuery,
} from "../src/lib/launch/database-preflight";
import {
  formatReadinessReport,
  readinessExitCode,
  runLaunchReadiness,
} from "../src/lib/launch/readiness";

async function main() {
  const report = await runLaunchReadiness(process.env, {
    inspectDatabase: () =>
      inspectPaymentSchema(db.$queryRaw.bind(db) as unknown as RawQuery),
    fetch,
  });
  console.log(formatReadinessReport(report));
  process.exitCode = readinessExitCode(report);
}

main()
  .catch(() => {
    console.error("[FAIL] launch-check: readiness check could not complete.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
