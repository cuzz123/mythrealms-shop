import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus, Pencil } from "lucide-react";
import { requireAdminPage } from "@/lib/server/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdminPage();
  const posts = await db.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new"><Button variant="accent" size="sm"><Plus className="w-4 h-4 mr-1" /> New Post</Button></Link>
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-light)] text-left bg-[var(--bg)]">
              <th className="py-3 px-4 font-semibold">Title</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Author</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id} className="border-b border-[var(--border-light)]">
                <td className="py-3 px-4 font-medium">{post.title}</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">{post.category}</td>
                <td className="py-3 px-4">{post.author?.name || "—"}</td>
                <td className="py-3 px-4 text-[var(--text-muted)]">{new Date(post.publishedAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <Link href={`/admin/blog/${post.id}`} className="p-2 hover:bg-[var(--border-light)] rounded inline-block"><Pencil className="w-4 h-4" /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center py-12 text-[var(--text-muted)]">No blog posts yet.</p>}
      </div>
    </div>
  );
}
