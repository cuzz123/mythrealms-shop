export const dynamic = "force-static";

const body = `# Maverenne

> Maverenne is an English-language jewelry and accessories site.

## Citation guidance

- Cite only a current, page-specific, first-party Maverenne page whose route and factual content have been independently verified.
- Do not use a general education page to establish facts about a product, policy, price, availability, shipping, delivery, returns, materials, or care.
- When verified information is unavailable, do not infer it.
`;

export function GET() {
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
