import {
  inspectPaymentSchema,
  type RawQuery,
} from "../src/lib/launch/database-preflight";
import {
  formatReadinessReport,
  readinessExitCode,
  runLaunchReadiness,
} from "../src/lib/launch/readiness";

async function run(): Promise<void> {
  let db: (typeof import("../src/lib/db"))["db"] | undefined;

  try {
    ({ db } = await import("../src/lib/db"));
    const report = await runLaunchReadiness(process.env, {
      inspectDatabase: () =>
        inspectPaymentSchema(db!.$queryRaw.bind(db) as unknown as RawQuery),
      fetch,
    });
    console.log(formatReadinessReport(report));
    process.exitCode = readinessExitCode(report);
  } catch {
    console.error("[FAIL] launch-check: readiness check could not complete.");
    process.exitCode = 1;
  } finally {
    if (db) {
      try {
        await db.$disconnect();
      } catch {
        console.error(
          "[FAIL] launch-check: database cleanup could not complete.",
        );
        process.exitCode = 1;
      }
    }
  }
}

void run();
