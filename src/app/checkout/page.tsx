"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("US");
  const [zip, setZip] = useState("");

  const shipping = subtotal() >= 69.99 ? 0 : 4.99;
  const total = subtotal() + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">Your cart is empty</h1>
        <Link href="/collections/beast-pendants"><Button variant="primary">Shop Now</Button></Link>
      </div>
    );
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.product.variantId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            image: item.product.image,
          })),
          email,
          shippingAddress: { name, phone, address, city, state, country, zip },
        }),
      });

      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Checkout failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)]";

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text)]">Home</Link><span>/</span>
        <Link href="/cart" className="hover:text-[var(--text)]">Cart</Link><span>/</span>
        <span className="text-[var(--text)]">Checkout</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-8">Checkout</h1>

      <form onSubmit={handleCheckout}>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div className="space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-4">Contact Information</h2>
              <div className="space-y-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className={inputClass} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={inputClass} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className={inputClass} />
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
                  <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="State / Province" className={inputClass} />
                  <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP / Postal code" className={inputClass} />
                </div>
                <select value={country} onChange={(e) => setCountry(e.target.value)} className={`${inputClass} cursor-pointer`}>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="sticky top-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-4 pb-3 border-b border-[var(--border)]">Your Order</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.product.variantId}`} className="flex gap-3 text-sm">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text)] line-clamp-1">{item.product.name}</p>
                    <p className="text-[var(--text-muted)]">Qty: {item.quantity} x {formatPrice(item.product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]"><span>Subtotal</span><span>{formatPrice(subtotal())}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-secondary)]">Shipping</span><span className={shipping===0?'text-[var(--success)]':''}>{shipping===0?'FREE':formatPrice(shipping)}</span></div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--border)]"><span className="text-[var(--text)]">Total</span><span className="text-[var(--text)]">{formatPrice(total)}</span></div>
            </div>
            <Button variant="primary" size="lg" type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : `Pay ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
