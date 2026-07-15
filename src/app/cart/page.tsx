"use client";

import { useState } from "react";
import { useCartStore, CartProduct } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { LazyImage } from "@/components/ui/LazyImage";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, TicketPercent, CheckCircle2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [discountValue, setDiscountValue] = useState(0);
  const [discountLabel, setDiscountLabel] = useState("");
  const [validating, setValidating] = useState(false);
  const shipping = subtotal() >= 69.99 ? 0 : 4.99;
  const discountAmount = discountApplied ? discountValue : 0;
  const total = subtotal() + shipping - discountAmount;
  const isEmpty = items.length === 0;

  const handleApplyDiscount = async () => {
    const code = discountCode.trim();
    if (!code) return;
    setValidating(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: subtotal() }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountApplied(true);
        setDiscountValue(data.discountValue ?? subtotal() * 0.15);
        setDiscountLabel(data.label || code);
      } else {
        setDiscountApplied(false);
        setDiscountError(data.error || "Invalid discount code");
      }
    } catch {
      setDiscountError("Unable to validate code. Please try again.");
    } finally {
      setValidating(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-[#1A1812] border border-[#3A3220] flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-9 h-9 text-[var(--accent)]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-3">Your cart is waiting</h1>
        <p className="text-[var(--text-muted)] mb-8 max-w-sm mx-auto leading-relaxed">Fill it with hand-selected stones — each piece is individually chosen for its unique character and energy.</p>
        <Link href="/collections/curated-singles" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--accent)] text-[var(--bg)] font-semibold text-sm hover:brightness-110 transition-all">
          <ShoppingBag className="w-4 h-4" />
          Browse Curated Singles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <a href="/" className="hover:text-[var(--text)]">Home</a><span>/</span><span className="text-[var(--text)]">Shopping Cart</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.product.variantId}`} className="grid grid-cols-[80px_1fr_auto_auto] gap-4 items-center p-5 border-b border-[var(--border)] last:border-b-0">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[var(--border-light)]">
                <LazyImage src={imageUrl(item.product.image)} alt={item.product.name} fill sizes="80px" className="object-cover" containerClassName="absolute inset-0" />
              </div>
              <div>
                <h3 className="text-sm font-semibold line-clamp-2 mb-1 text-[var(--text)]">{item.product.name}</h3>
                {item.product.variantName && <p className="text-xs text-[var(--text-muted)]">{item.product.variantName}</p>}
                <p className="text-xs text-[var(--text-muted)] mt-1">{formatPrice(item.product.price)} each</p>
              </div>
              <div className="flex items-center border border-[var(--border)] rounded-full">
                <button onClick={() => updateQuantity(item.product.id, item.product.variantId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--border-light)] rounded-l-full text-[var(--text)]"><Minus className="w-3 h-3" /></button>
                <span className="w-10 text-center text-sm font-semibold text-[var(--text)]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.product.id, item.product.variantId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-[var(--border-light)] rounded-r-full text-[var(--text)]"><Plus className="w-3 h-3" /></button>
              </div>
              <div className="text-right min-w-[70px]">
                <p className="font-bold text-[var(--text)]">{formatPrice(item.product.price * item.quantity)}</p>
                <button onClick={() => removeItem(item.product.id, item.product.variantId)} className="text-[var(--text-muted)] hover:text-red-400 mt-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}

          {/* Discount Code */}
          <div className="p-5 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-3">
              <TicketPercent className="w-4 h-4 text-[var(--text-muted)]" />
              <span className="text-sm font-medium text-[var(--text)]">Discount Code</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => { setDiscountCode(e.target.value); setDiscountError(""); }}
                placeholder="Enter discount code"
                className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyDiscount}
                disabled={discountApplied}
              >
                {discountApplied ? "Applied" : "Apply"}
              </Button>
            </div>
            {discountApplied && (
              <p className="mt-2 flex items-center gap-1 text-sm text-[var(--success)]">
                <CheckCircle2 className="w-4 h-4" />
                {discountLabel || "Discount"} applied! You save {formatPrice(discountAmount)}
              </p>
            )}
            {discountError && (
              <p className="mt-2 text-sm text-[var(--sale)]">{discountError}</p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="sticky top-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
          <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-5 pb-4 border-b border-[var(--border)]">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-[var(--text-secondary)]"><span>Subtotal ({items.reduce((s,i)=>s+i.quantity,0)} items)</span><span>{formatPrice(subtotal())}</span></div>
            <div className={`flex justify-between ${shipping===0?'text-[var(--success)]':''}`}><span>Shipping</span><span>{shipping===0?'FREE':formatPrice(shipping)}</span></div>
            {shipping > 0 && <p className="text-xs text-[var(--text-muted)]">Add {formatPrice(69.99 - subtotal())} more for FREE shipping</p>}
            {discountApplied && (
              <div className="flex justify-between text-[var(--success)]"><span>Discount ({discountLabel || "Applied"})</span><span>-{formatPrice(discountAmount)}</span></div>
            )}
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-[var(--border)]"><span className="text-[var(--text)]">Total</span><span className="text-[var(--text)]">{formatPrice(total)}</span></div>
          </div>
          <Link href="/checkout">
            <Button variant="primary" size="lg" className="w-full mt-6">Proceed to Checkout</Button>
          </Link>
          <p className="mt-4 text-center text-xs font-semibold text-[var(--text-muted)]">
            Checkout securely with PayPal
          </p>
          <Link href="/collections/curated-singles" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] mt-6 justify-center"><ArrowLeft className="w-4 h-4" /> Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
