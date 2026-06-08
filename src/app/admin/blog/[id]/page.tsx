import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BlogEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-3xl font-bold mb-4">Post Not Found</h1>
        <Link href="/admin/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  async function updatePost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as string;

    await db.blogPost.update({
      where: { id },
      data: { title, slug, excerpt, content, category, image: image || null },
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/admin/blog/${id}`);
    redirect("/admin/blog");
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blog" className="p-2 hover:bg-[var(--border-light)] rounded">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-3xl font-bold">Edit Post</h1>
      </div>

      <form action={updatePost} className="space-y-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title</label>
            <input name="title" defaultValue={post.title} required className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Slug</label>
            <input name="slug" defaultValue={post.slug} required className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <input name="category" defaultValue={post.category} required className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Image URL</label>
            <input name="image" defaultValue={post.image || ""} className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Excerpt</label>
            <textarea name="excerpt" defaultValue={post.excerpt} required rows={3} className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Content (Markdown)</label>
            <textarea name="content" defaultValue={post.content} required rows={12} className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm font-mono" />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" type="submit">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
          <Link href="/admin/blog">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
