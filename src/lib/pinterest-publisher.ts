export type PinterestPinInput = {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
};

type PinterestApiResponse = {
  id?: string;
  message?: string;
  code?: number;
};

export async function publishPinterestPin(input: PinterestPinInput): Promise<{ pinId: string }> {
  const token =
    process.env.PINTEREST_API_TOKEN ||
    (await cookies()).get("pinterest_access_token")?.value;
  const boardId = process.env.PINTEREST_BOARD_ID;

  if (!token || !boardId) {
    throw new Error("Pinterest API is not configured");
  }

  const response = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      link: input.link,
      board_id: boardId,
      media_source: {
        source_type: "image_url",
        url: input.imageUrl,
      },
    }),
  });

  const body = (await response.json().catch(() => ({}))) as PinterestApiResponse;
  if (!response.ok || !body.id) {
    throw new Error(body.message || `Pinterest API request failed (${response.status})`);
  }

  return { pinId: body.id };
}
import { cookies } from "next/headers";
