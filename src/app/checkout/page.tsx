"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { LazyImage } from "@/components/ui/LazyImage";
import Link from "next/link";
import { Loader2, Tag, Check, AlertCircle, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const COUNTRY_NAMES: Record<string, string> = { US:"United States",GB:"United Kingdom",CA:"Canada",AU:"Australia",DE:"Germany",FR:"France",JP:"Japan",SG:"Singapore",IT:"Italy",ES:"Spain",NL:"Netherlands",SE:"Sweden",NO:"Norway",DK:"Denmark",FI:"Finland",CH:"Switzerland",AT:"Austria",BE:"Belgium",IE:"Ireland",NZ:"New Zealand",KR:"South Korea",HK:"Hong Kong",TW:"Taiwan",MY:"Malaysia",TH:"Thailand",PH:"Philippines",ID:"Indonesia",IN:"India",BR:"Brazil",MX:"Mexico",AE:"United Arab Emirates",SA:"Saudi Arabia",IL:"Israel",PT:"Portugal",PL:"Poland" };
const COUNTRY_CODES: Record<string, string> = Object.fromEntries(Object.entries(COUNTRY_NAMES).map(([k,v]) => [v,k]));

interface ValidationErrors {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

interface DiscountInfo {
  valid: boolean;
  discount: number;
  discountedSubtotal: number;
  appliedDiscounts: Array<{
    type: string;
    label: string;
    amount: number;
    description: string;
  }>;
}

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

  // Discount
  const [discountCode, setDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // Validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const shipping = subtotal() >= 69.99 ? 0 : 4.99;
  const discountedSubtotal = Math.max(0, subtotal() - (discountInfo?.discount ?? 0));
  const total = discountedSubtotal + shipping;

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"ls" | "paypal">("ls");

  // Re-validate discounts whenever the cart contents change so totals stay correct
  const itemsKey = items.map((i) => `${i.product.id}:${i.product.variantId ?? ""}:${i.quantity}`).join("|");
  useEffect(() => {
    if (items.length > 0) {
      validateDiscount(""); // recompute B2G1 + discount totals for the current cart
    } else {
      setDiscountInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsKey]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
          Your cart is empty
        </h1>
        <Link href="/collections/curated-singles">
          <Button variant="primary">Shop Now</Button>
        </Link>
      </div>
    );
  }

  // --- Validation ---
  function validateField(field: string, value: string): string {
    switch (field) {
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Please enter a valid email";
        return "";
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "phone":
        if (!value.trim()) return "Phone is required for shipping";
        if (!/^[\d\s\-+()]{7,20}$/.test(value))
          return "Please enter a valid phone number";
        return "";
      case "address":
        if (!value.trim()) return "Address is required";
        if (value.trim().length < 5) return "Please enter a complete address";
        return "";
      case "city":
        if (!value.trim()) return "City is required";
        return "";
      case "state":
        if (!value.trim()) return "State/Province is required";
        return "";
      case "zip":
        if (!value.trim()) return "ZIP/Postal code is required";
        if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(value))
          return "Please enter a valid postal code";
        return "";
      default:
        return "";
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value =
      field === "email"
        ? email
        : field === "name"
        ? name
        : field === "phone"
        ? phone
        : field === "address"
        ? address
        : field === "city"
        ? city
        : field === "state"
        ? state
        : field === "zip"
        ? zip
        : "";
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function validateAll(): boolean {
    const fields: Record<string, string> = {
      email,
      name,
      phone,
      address,
      city,
      state,
      zip,
    };
    const newErrors: ValidationErrors = {};
    let valid = true;
    for (const [field, value] of Object.entries(fields)) {
      const error = validateField(field, value);
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        valid = false;
      }
    }
    setErrors(newErrors);
    setTouched(
      Object.keys(fields).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    );
    return valid;
  }

  // --- Discount ---
  async function validateDiscount(code?: string) {
    const codeToUse = code ?? discountCode;
    setDiscountLoading(true);
    setDiscountError("");

    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToUse || undefined,
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.product.variantId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
          })),
          email: email || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setDiscountError(data.error || "Invalid discount code");
        // Keep B2G1 auto discounts even if manual code fails
        if (data.appliedDiscounts) {
          setDiscountInfo(data);
        }
        return;
      }

      setDiscountInfo(data);
      if (data.appliedDiscounts?.length > 0) {
        toast.success(
          `${data.appliedDiscounts.length} discount${data.appliedDiscounts.length > 1 ? "s" : ""} applied!`
        );
      }
    } catch (err: any) {
      console.error("Discount validation error:", err);
      setDiscountError(err?.message || "Failed to validate discount. Please try again.");
    } finally {
      setDiscountLoading(false);
    }
  }

  function handleApplyDiscount(e: React.MouseEvent) {
    e.preventDefault();
    if (discountCode.trim()) {
      validateDiscount();
    }
  }

  function handleRemoveDiscount(type: string) {
    if (!discountInfo) return;
    const remaining = discountInfo.appliedDiscounts.filter(
      (d) => d.type !== type
    );
    if (remaining.length === 0) {
      setDiscountInfo(null);
      setDiscountCode("");
    } else {
      // Recalculate with remaining discounts
      validateDiscount(type === "code" ? "" : discountCode);
    }
    if (type === "code") setDiscountCode("");
  }

  // --- Checkout ---
  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    if (!validateAll()) {
      toast.error("Please fix the errors below");
      return;
    }

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
          discount: discountInfo
            ? {
                amount: discountInfo.discount,
                codes: discountInfo.appliedDiscounts.map((d) => d.label),
              }
            : undefined,
        }),
      });

      const data = await res.json();
      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Checkout failed");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 border rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors";
  const inputErrorClass = "border-[var(--sale)]";
  const inputNormalClass = "border-[var(--border)]";

  function renderField(
    field: keyof ValidationErrors,
    label: string,
    type: string = "text",
    required: boolean = true,
    placeholder?: string,
    autoComplete?: string,
    inputMode?: string,
  ) {
    const valueMap: Record<string, string> = {
      email,
      name,
      phone,
      address,
      city,
      state,
      zip,
    };
    const setterMap: Record<string, (v: string) => void> = {
      email: setEmail,
      name: setName,
      phone: setPhone,
      address: setAddress,
      city: setCity,
      state: setState,
      zip: setZip,
    };

    const hasError = touched[field] && errors[field];

    return (
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
          {label}
          {required && (
            <span className="text-[var(--sale)] ml-0.5">*</span>
          )}
        </label>
        <input
          type={type}
          value={valueMap[field]}
          onChange={(e) => {
            setterMap[field](e.target.value);
            if (touched[field]) {
              const error = validateField(field, e.target.value);
              setErrors((prev) => ({ ...prev, [field]: error }));
            }
          }}
          onBlur={() => handleBlur(field)}
          placeholder={placeholder || label}
          autoComplete={autoComplete}
          inputMode={inputMode as any}
          aria-invalid={!!hasError}
          aria-describedby={hasError ? `${field}-error` : undefined}
          className={`${inputClass} ${hasError ? inputErrorClass : inputNormalClass}`}
        />
        {hasError && (
          <p id={`${field}-error`} className="mt-1 text-xs text-[var(--sale)] flex items-center gap-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-6">
        <Link href="/" className="hover:text-[var(--text)]">
          Home
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-[var(--text)]">
          Cart
        </Link>
        <span>/</span>
        <span className="text-[var(--text)]">Checkout</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold text-[var(--text)] mb-8">
        Checkout
      </h1>

      <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg p-4 mb-6 text-sm text-[var(--text-secondary)]">
        <strong className="text-[var(--accent)]">Crafted to Order</strong> —
        Each MythRealms piece is handcrafted upon order. Please allow{" "}
        <strong>2-3 weeks</strong> for production and delivery. You will receive
        updates at every stage.
      </div>

      <form onSubmit={handleCheckout} noValidate>
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Left Column — Contact + Shipping */}
          <div className="space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                {renderField("email", "Email Address", "email", true, undefined, "email")}
                {renderField("name", "Full Name", "text", true, undefined, "name")}
                {renderField("phone", "Phone Number", "tel", true, undefined, "tel", "tel")}
              </div>
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
              <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-4">
                Shipping Address
              </h2>
              <div className="space-y-4">
                {renderField("address", "Street Address", "text", true, undefined, "street-address")}
                <div className="grid grid-cols-2 gap-4">
                  {renderField("city", "City", "text", true, undefined, "address-level2")}
                  {renderField("state", "State / Province", "text", true, undefined, "address-level1")}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {renderField("zip", "ZIP / Postal Code", "text", true, undefined, "postal-code", "numeric")}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                      Country <span className="text-[var(--sale)] ml-0.5">*</span>
                    </label>
                    <input
                      list="country-list"
                      value={COUNTRY_NAMES[country] || country}
                      onChange={(e) => {
                        const code = COUNTRY_CODES[e.target.value] || e.target.value;
                        setCountry(code);
                      }}
                      placeholder="Type to search..."
                      className={`${inputClass} ${inputNormalClass}`}
                    />
                    <datalist id="country-list">
                      {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                        <option key={code} value={name}>{code}</option>
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="sticky top-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
            <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-4 pb-3 border-b border-[var(--border)]">
              Your Order
            </h2>

            {/* Cart items */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.product.variantId}`}
                  className="flex gap-3 text-sm"
                >
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <LazyImage
                      src={imageUrl(item.product.image)}
                      alt={item.product.name}
                      fill
                      sizes="48px"
                      className="object-cover rounded"
                      containerClassName="absolute inset-0"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text)] line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-[var(--text-muted)]">
                      Qty: {item.quantity} x {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Discount Code */}
            <div className="border-t border-[var(--border)] mt-4 pt-4">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Discount Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    setDiscountError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      validateDiscount();
                    }
                  }}
                  placeholder="Enter code"
                  className={`flex-1 px-3 py-2 border rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] ${
                    discountError
                      ? "border-[var(--sale)]"
                      : "border-[var(--border)]"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  disabled={discountLoading || !discountCode.trim()}
                  className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition"
                >
                  {discountLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
              {discountError && (
                <p className="mt-1.5 text-xs text-[var(--sale)] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {discountError}
                </p>
              )}
            </div>

            {/* Applied Discounts */}
            {discountInfo?.appliedDiscounts &&
              discountInfo.appliedDiscounts.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {discountInfo.appliedDiscounts.map((d) => (
                    <div
                      key={d.type + d.label}
                      className="flex items-center justify-between bg-[var(--success)]/10 border border-[var(--success)]/20 rounded-lg px-3 py-2 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Check className="w-4 h-4 text-[var(--success)] flex-shrink-0" />
                        <div>
                          <span className="font-medium text-[var(--success)]">
                            {d.label}
                          </span>
                          <span className="text-[var(--text-muted)] ml-1.5 text-xs">
                            {d.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[var(--success)] font-medium">
                          −{formatPrice(d.amount)}
                        </span>
                        {d.type === "code" && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDiscount(d.type)}
                            className="text-[var(--text-muted)] hover:text-[var(--sale)] transition"
                            aria-label={`Remove ${d.label}`}
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Totals */}
            <div className="border-t border-[var(--border)] mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>

              {discountInfo && discountInfo.discount > 0 && (
                <div className="flex justify-between text-[var(--success)]">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Discount
                  </span>
                  <span>−{formatPrice(discountInfo.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Shipping</span>
                <span className={shipping === 0 ? "text-[var(--success)]" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  Free shipping on orders over $69.99 — add{" "}
                  {formatPrice(69.99 - discountedSubtotal)} more
                </p>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--border)]">
                <span className="text-[var(--text)]">Total</span>
                <span className="text-[var(--text)]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mt-6">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("ls")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition ${
                    paymentMethod === "ls"
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition ${
                    paymentMethod === "paypal"
                      ? "border-[#0070BA] bg-[#0070BA]/10 text-[#0070BA]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <span className="font-bold italic">P</span>
                  PayPal
                </button>
              </div>
            </div>

            {/* Processing fee note */}
            <p className="mt-3 text-xs text-[var(--text-muted)] text-center">
              A small processing fee may be added by the payment provider.
            </p>

            {/* Trust signals */}
            <div className="mt-4 mb-4 flex items-center justify-center gap-3 text-xs bg-[var(--success)]/5 border border-[var(--success)]/10 rounded-lg py-2 px-4">
              <svg className="w-4 h-4 text-[var(--success)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="text-[var(--success)] font-medium">SSL Encrypted</span>
              <span className="text-[var(--border)]">|</span>
              <Check className="w-3.5 h-3.5 text-[var(--success)]" />
              <span className="text-[var(--success)]">30-Day Returns</span>
            </div>

            {/* Pay Button */}
            {paymentMethod === "paypal" ? (
              <div id="paypal-button-container" className="mt-4" />
            ) : (
              <Button
                variant="primary"
                size="lg"
                type="submit"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ${formatPrice(total)}`
                )}
              </Button>
            )}

            {/* Trust signals */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <Check className="w-3 h-3 text-[var(--success)]" />
              Free Shipping over $69.99
              <span className="text-[var(--border)]">|</span>
              <Check className="w-3 h-3 text-[var(--success)]" />
              30-day returns
            </div>
          </div>
        </div>
      </form>

      {/* PayPal SDK — loaded via useEffect for reliable popup */}
      {paymentMethod === "paypal" && (
        <PayPalButton
          paymentMethod={paymentMethod}
          items={items}
          email={email}
          shippingAddress={{ name, phone, address, city, state, country, zip }}
          discountInfo={discountInfo}
          total={total}
          onSuccess={() => {
            clearCart();
          }}
        />
      )}
    </div>
  );
}

// Separate PayPal button component to manage SDK lifecycle
function PayPalButton({
  items, email, shippingAddress, discountInfo, total, onSuccess, paymentMethod,
}: {
  items: any[];
  email: string;
  shippingAddress: any;
  discountInfo: any;
  total: number;
  onSuccess: () => void;
  paymentMethod: string;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const buttonsRef = useRef<any>(null);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  useEffect(() => {
    if (!paypalClientId) return;
    if (paymentMethod !== "paypal") return;
    if (document.getElementById("paypal-sdk")) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&intent=capture&disable-funding=credit,paylater&locale=en_US&buyer-country=US`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => toast.error("Failed to load PayPal. Please try Card payment.");
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  useEffect(() => {
    if (!paypalClientId) return;
    if (!sdkReady) return;
    const container = document.getElementById("paypal-button-container");
    if (!container || !(window as any).paypal) return;

    // Skip re-render if buttons already exist (prevents flash on re-renders)
    if (container.children.length > 0) return;

    (window as any).paypal.Buttons({
      // createOrder calls POST /api/checkout/paypal which sets
      // PayPal's purchase_units[0].custom_id = order.id so the
      // webhook can map incoming payments back to our DB orders.
      createOrder: async () => {
        const res = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.product.id, variantId: item.product.variantId,
              quantity: item.quantity, price: item.product.price, name: item.product.name,
            })),
            email,
            shippingAddress,
            discount: discountInfo ? { amount: discountInfo.discount } : undefined,
          }),
        });
        const data = await res.json();
        if (data.error) { toast.error(data.error); throw new Error(data.error); }
        (window as any).__mythrealmsOrderId = data.dbOrderId;
        return data.orderId;
      },
      onApprove: async (data: any) => {
        const dbOrderId = (window as any).__mythrealmsOrderId || data.orderID;
        try {
          const res = await fetch("/api/checkout/paypal/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paypalOrderId: data.orderID, dbOrderId }),
          });
          const result = await res.json();
          if (!res.ok || !result.success) {
            toast.error(result.error || "Payment could not be completed. Please contact support.");
            return;
          }
          onSuccess();
          window.location.href = `/checkout/success?orderId=${dbOrderId}`;
        } catch {
          toast.error("Payment confirmation failed. Please contact support.");
        }
      },
      onCancel: () => { toast.error("Payment cancelled."); },
      onError: (err: any) => { toast.error("Payment failed. Please try again."); console.error("PayPal error:", err); },
      style: { color: "gold", shape: "rect", label: "paypal", height: 48 },
    }).render("#paypal-button-container").then((instance: any) => {
      buttonsRef.current = instance;
    });

    return () => {
      if (buttonsRef.current && typeof buttonsRef.current.close === "function") {
        buttonsRef.current.close();
        buttonsRef.current = null;
      }
    };
  }, [sdkReady]);

  if (!paypalClientId) {
    return (
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        PayPal is temporarily unavailable. Please use Card.
      </p>
    );
  }
  if (!sdkReady) {
    return <div className="mt-4 h-12 bg-[var(--border)] rounded animate-pulse" />;
  }
  return null;
}
