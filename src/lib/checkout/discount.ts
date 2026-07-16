import { db } from "@/lib/db";
import type { DiscountRepository } from "@/lib/checkout/quote";

export const prismaDiscountRepository: DiscountRepository = {
  findDiscountByCode(code) {
    return db.discountCode.findUnique({ where: { code } });
  },
  countPaidOrdersByEmail(email) {
    return db.order.count({
      where: {
        email,
        status: { in: ["PAID", "SHIPPED", "DELIVERED"] },
      },
    });
  },
};
