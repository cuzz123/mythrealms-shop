export interface PaymentSchemaState {
  tableExists: boolean;
  confirmationClaimedAtExists: boolean;
  confirmationSentAtExists: boolean;
}

export type RawQuery = <T>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => PromiseLike<T>;

export interface DatabaseCheck {
  ok: boolean;
  missing: string[];
}

export async function inspectPaymentSchema(
  queryRaw: RawQuery,
): Promise<DatabaseCheck> {
  const rows = await queryRaw<PaymentSchemaState[]>`
    SELECT
      EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = current_schema() AND table_name = 'Order'
      ) AS "tableExists",
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Order'
          AND column_name = 'confirmationClaimedAt'
      ) AS "confirmationClaimedAtExists",
      EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Order'
          AND column_name = 'confirmationSentAt'
      ) AS "confirmationSentAtExists"
  `;
  const state = rows[0] ?? {
    tableExists: false,
    confirmationClaimedAtExists: false,
    confirmationSentAtExists: false,
  };
  const missing = [
    ...(!state.tableExists ? ["current_schema().Order"] : []),
    ...(!state.confirmationClaimedAtExists
      ? ["current_schema().Order.confirmationClaimedAt"]
      : []),
    ...(!state.confirmationSentAtExists
      ? ["current_schema().Order.confirmationSentAt"]
      : []),
  ];
  return { ok: missing.length === 0, missing };
}
