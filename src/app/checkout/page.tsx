"use client";

import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/lib/cart";
import { buildDiscountPreviewRequest } from "@/lib/checkout/discount-preview";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { imageUrl } from "@/lib/images";
import { STORE_POLICY_FACTS } from "@/lib/storefront/policies";
import { LazyImage } from "@/components/ui/LazyImage";
import Link from "next/link";
import { Loader2, Tag, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const COUNTRY_NAMES: Record<string, string> = { US:"United States",GB:"United Kingdom",CA:"Canada",AU:"Australia",DE:"Germany",FR:"France",JP:"Japan",SG:"Singapore",IT:"Italy",ES:"Spain",NL:"Netherlands",SE:"Sweden",NO:"Norway",DK:"Denmark",FI:"Finland",CH:"Switzerland",AT:"Austria",BE:"Belgium",IE:"Ireland",NZ:"New Zealand",KR:"South Korea",HK:"Hong Kong",TW:"Taiwan",MY:"Malaysia",TH:"Thailand",PH:"Philippines",ID:"Indonesia",IN:"India",BR:"Brazil",MX:"Mexico",AE:"United Arab Emirates",SA:"Saudi Arabia",IL:"Israel",PT:"Portugal",PL:"Poland" };
const COUNTRY_CODES: Record<string, string> = Object.fromEntries(Object.entries(COUNTRY_NAMES).map(([k,v]) => [v,k]));
const freeShippingThreshold =
  STORE_POLICY_FACTS.freeShippingThresholdUsd.toFixed(2);
const standardShippingFlatRate =
  STORE_POLICY_FACTS.standardShippingFlatRateUsd.toFixed(2);

interface ValidationErrors {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
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

type CheckoutItem = ReturnType<typeof useCartStore.getState>["items"][number];

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface PayPalApprovalData {
  orderID: string;
}

interface PayPalButtonsComponent {
  render: (selector: string) => Promise<void>;
  close?: () => void;
}

interface PayPalNamespace {
  FUNDING: { PAYPAL: string };
  Buttons: (options: {
    fundingSource: string;
    createOrder: () => Promise<string>;
    onApprove: (data: PayPalApprovalData) => Promise<void>;
    onCancel: () => void;
    onError: (error: unknown) => void;
    style: {
      color: string;
      shape: string;
      label: string;
      height: number;
    };
  }) => PayPalButtonsComponent;
}

interface MythRealmsWindow extends Window {
  paypal?: PayPalNamespace;
  __mythrealmsOrderId?: string;
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
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
  const [appliedDiscountCode, setAppliedDiscountCode] = useState("");
  const [discountInfo, setDiscountInfo] = useState<DiscountInfo | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");

  // Validation
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const shipping = subtotal() >= 69.99 ? 0 : 4.99;
  const discountedSubtotal = Math.max(0, subtotal() - (discountInfo?.discount ?? 0));
  const total = discountedSubtotal + shipping;

  // Re-validate discounts whenever the cart contents change so totals stay correct
  const itemsKey = items.map((i) => `${i.product.id}:${i.product.variantId ?? ""}:${i.quantity}`).join("|");
  useEffect(() => {
    if (items.length > 0) {
      validateDiscount(appliedDiscountCode);
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
        <Link href="/collections/pearl-series">
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
      case "country":
        if (!COUNTRY_NAMES[value]) return "Please select a valid country";
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
        : field === "country"
        ? country
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
      country,
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
        body: JSON.stringify(
          buildDiscountPreviewRequest(items, codeToUse, email),
        ),
      });

      const data = await res.json();
      if (!res.ok) {
        setAppliedDiscountCode("");
        setDiscountInfo(null);
        setDiscountError(data.error || "Invalid discount code");
        return;
      }

      setDiscountInfo(data);
      setAppliedDiscountCode(codeToUse.trim().toUpperCase());
      if (data.appliedDiscounts?.length > 0) {
        toast.success(
          `${data.appliedDiscounts.length} discount${data.appliedDiscounts.length > 1 ? "s" : ""} applied!`
        );
      }
    } catch (err: unknown) {
      setAppliedDiscountCode("");
      setDiscountInfo(null);
      console.error("Discount validation error:", err);
      setDiscountError(
        err instanceof Error
          ? err.message
          : "Failed to validate discount. Please try again.",
      );
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
      setAppliedDiscountCode("");
    } else {
      // Recalculate with remaining discounts
      validateDiscount(type === "code" ? "" : discountCode);
    }
    if (type === "code") setDiscountCode("");
    if (type === "code") setAppliedDiscountCode("");
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
    inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"],
  ) {
    const valueMap: Record<string, string> = {
      email,
      name,
      phone,
      address,
      city,
      state,
      zip,
      country,
    };
    const setterMap: Record<string, (v: string) => void> = {
      email: setEmail,
      name: setName,
      phone: setPhone,
      address: setAddress,
      city: setCity,
      state: setState,
      zip: setZip,
      country: setCountry,
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
          inputMode={inputMode}
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

      <form onSubmit={(event) => event.preventDefault()} noValidate>
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
                      onBlur={() => handleBlur("country")}
                      placeholder="Type to search..."
                      aria-invalid={!!(touched.country && errors.country)}
                      aria-describedby={errors.country ? "country-error" : undefined}
                      className={`${inputClass} ${
                        touched.country && errors.country
                          ? inputErrorClass
                          : inputNormalClass
                      }`}
                    />
                    {touched.country && errors.country && (
                      <p id="country-error" className="mt-1 text-xs text-[var(--sale)]">
                        {errors.country}
                      </p>
                    )}
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
          <div className="sticky top-24 bg-[var(--surface-alt)] border border-[var(--border)] rounded-xl p-6">
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
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded-lg text-sm font-medium hover:bg-[var(--accent-hover)] disabled:opacity-50 transition"
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
                  Free shipping on orders of ${freeShippingThreshold} or more - add{" "}
                  {formatPrice(69.99 - discountedSubtotal)} more
                </p>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--border)]">
                <span className="text-[var(--text)]">Total</span>
                <span className="text-[var(--text)]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-6">
              <p className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                Payment
              </p>
              <div className="rounded-lg border border-[#0070BA]/30 bg-[#0070BA]/5 p-3 text-center text-sm text-[#0070BA]">
                PayPal
              </div>
              <div id="paypal-button-container" className="mt-4" />
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

            {/* Trust signals */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[var(--text-muted)]">
              <Check className="w-3 h-3 text-[var(--success)]" />
              ${standardShippingFlatRate} shipping below ${freeShippingThreshold}
              <span className="text-[var(--border)]">|</span>
              Free at ${freeShippingThreshold} or more
              <span className="text-[var(--border)]">|</span>
              <Check className="w-3 h-3 text-[var(--success)]" />
              30-day returns
            </div>
          </div>
        </div>
      </form>

      {/* PayPal SDK — loaded via useEffect for reliable popup */}
      <PayPalButton
        items={items}
        email={email}
        shippingAddress={{ name, phone, address, city, state, country, zip }}
        discountCode={appliedDiscountCode}
        validateForm={validateAll}
        onSuccess={clearCart}
      />
    </div>
  );
}

// Separate PayPal button component to manage SDK lifecycle
function PayPalButton({
  items,
  email,
  shippingAddress,
  discountCode,
  validateForm,
  onSuccess,
}: {
  items: CheckoutItem[];
  email: string;
  shippingAddress: ShippingAddress;
  discountCode: string;
  validateForm: () => boolean;
  onSuccess: () => void;
}) {
  const [sdkReady, setSdkReady] = useState(false);
  const buttonsRef = useRef<PayPalButtonsComponent | null>(null);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const payloadRef = useRef({ items, email, shippingAddress, discountCode });
  const validateRef = useRef(validateForm);
  payloadRef.current = { items, email, shippingAddress, discountCode };
  validateRef.current = validateForm;

  useEffect(() => {
    if (!paypalClientId) return;
    if (document.getElementById("paypal-sdk")) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk";
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD&intent=capture`;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => toast.error("Please try PayPal again later.");
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, [paypalClientId]);

  useEffect(() => {
    if (!paypalClientId) return;
    if (!sdkReady) return;
    const container = document.getElementById("paypal-button-container");
    const paypalWindow = window as MythRealmsWindow;
    const paypal = paypalWindow.paypal;
    if (!container || !paypal) return;

    // Skip re-render if buttons already exist (prevents flash on re-renders)
    if (container.children.length > 0) return;

    const buttons = paypal.Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,
      // createOrder calls POST /api/checkout/paypal which sets
      // PayPal's purchase_units[0].custom_id = order.id so the
      // webhook can map incoming payments back to our DB orders.
      createOrder: async () => {
        if (!validateRef.current()) {
          toast.error("Please complete your contact and shipping information");
          throw new Error("Checkout form is incomplete");
        }
        const latest = payloadRef.current;
        const res = await fetch("/api/checkout/paypal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: latest.items.map((item) => ({
              productId: item.product.id,
              variantId: item.product.variantId,
              quantity: item.quantity,
            })),
            email: latest.email,
            shippingAddress: latest.shippingAddress,
            discountCode: latest.discountCode.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (data.error) { toast.error(data.error); throw new Error(data.error); }
        paypalWindow.__mythrealmsOrderId = data.dbOrderId;
        return data.orderId;
      },
      onApprove: async (data: PayPalApprovalData) => {
        const dbOrderId = paypalWindow.__mythrealmsOrderId || data.orderID;
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
      onError: (err: unknown) => { toast.error("Payment failed. Please try again."); console.error("PayPal error:", err); },
      style: { color: "gold", shape: "rect", label: "paypal", height: 48 },
    });
    buttonsRef.current = buttons;
    void buttons.render("#paypal-button-container");

    return () => {
      if (buttonsRef.current && typeof buttonsRef.current.close === "function") {
        buttonsRef.current.close();
        buttonsRef.current = null;
      }
    };
  }, [sdkReady, paypalClientId, onSuccess]);

  if (!paypalClientId) {
    return (
      <p className="mt-4 text-sm text-[var(--text-muted)]">
        Please try PayPal again later.
      </p>
    );
  }
  if (!sdkReady) {
    return <div className="mt-4 h-12 bg-[var(--border)] rounded animate-pulse" />;
  }
  return null;
}
