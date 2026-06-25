import { redirect } from "next/navigation";

/**
 * /products has no standalone listing — products live under /collections and /products/[slug].
 * Redirect to the main collections page.
 */
export default function ProductsPage() {
  redirect("/collections");
}
