type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

type AccountSession = {
  user?: { email?: string | null };
  expires?: string;
};

export function getAccountSessionKey(session: AccountSession | null): string | null {
  if (!session) return null;
  return `${session.user?.email || "member"}:${session.expires || "session"}`;
}

export async function loadAccountOrders<Order = unknown>(
  fetcher: Fetcher = fetch,
): Promise<Order[]> {
  const response = await fetcher("/api/account/orders");
  if (!response.ok) throw new Error("Failed to load orders");
  const data = (await response.json()) as { orders?: Order[] };
  return data.orders || [];
}

export async function loadLoyaltyPoints(fetcher: Fetcher = fetch): Promise<number> {
  const response = await fetcher("/api/account/loyalty");
  const data = (await response.json()) as { points?: unknown };
  return typeof data.points === "number" && Number.isFinite(data.points) ? data.points : 0;
}
