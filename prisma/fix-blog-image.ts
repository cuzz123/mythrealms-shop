import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  // Fix broken blog image — use a guaranteed-existing image
  await db.blogPost.update({
    where: { slug: "woman-who-wears-mythrealms" },
    data: { image: "/images/products/m28-jiao.png" }
  });
  console.log("Fixed blog image");
  await db.$disconnect();
}
main();
