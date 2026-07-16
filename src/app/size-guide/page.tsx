import Link from "next/link";
import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { Ruler, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Bracelet Size Guide — MythRealms",
  description: "Find your perfect bracelet size. Learn how to measure your wrist and choose between a snug or loose fit for your MythRealms bracelet.",
  alternates: { canonical: absoluteUrl("/size-guide") },
};

export default function SizeGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--text)] transition">Home</Link>
        <span>/</span>
        <span className="text-[var(--text)]">Size Guide</span>
      </nav>

      <h1 className="font-serif text-4xl font-bold mb-3">Bracelet Size Guide</h1>
      <p className="text-sm text-[var(--text-muted)] mb-10">Find your perfect fit. Learn how to measure your wrist and choose the right bracelet size.</p>

      {/* How to Measure */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">How to Measure Your Wrist</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          To find your ideal bracelet size, you will need a flexible measuring tape or a strip of paper and a ruler. Follow these simple steps:
        </p>

        <div className="space-y-5">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[var(--bg)] rounded-full flex items-center justify-center font-bold text-[var(--text)] text-sm">1</span>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-1">Wrap the measuring tape</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Wrap a flexible measuring tape around your wrist <strong>just below the wrist bone</strong> (the bony protrusion on the outside of your wrist). This is where a bracelet or watch would normally sit.
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[var(--bg)] rounded-full flex items-center justify-center font-bold text-[var(--text)] text-sm">2</span>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-1">Keep it snug but not tight</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                The tape should be flush against your skin without indenting it. Do not pull it too tight — you want your natural wrist measurement.
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[var(--bg)] rounded-full flex items-center justify-center font-bold text-[var(--text)] text-sm">3</span>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-1">No measuring tape? Use paper</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Wrap a strip of paper or a piece of string around your wrist. Mark where it overlaps, then lay it flat against a ruler to measure the length in centimeters.
              </p>
            </div>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5 flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-[var(--bg)] rounded-full flex items-center justify-center font-bold text-[var(--text)] text-sm">4</span>
            <div>
              <h3 className="font-semibold text-[var(--text)] mb-1">Measure your dominant hand</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                If you plan to wear the bracelet on your dominant wrist, measure that one — it may be slightly larger. For the most accurate result, measure both wrists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Size Chart */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">Recommended Bracelet Sizes</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          Once you have your wrist measurement, use the table below to find your recommended bracelet size. Our sizing accounts for a comfortable fit that allows the bracelet to move slightly on your wrist without falling off.
        </p>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg)] border-b border-[var(--border-light)]">
                <th className="text-left px-6 py-3 font-semibold text-[var(--text)]">Your Wrist Measurement</th>
                <th className="text-center px-6 py-3 font-semibold text-[var(--text)]">Recommended Bracelet Size</th>
                <th className="text-center px-6 py-3 font-semibold text-[var(--text)]">Fit Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-light)]">
              <tr>
                <td className="px-6 py-3 font-medium text-[var(--text)]">14 - 16 cm</td>
                <td className="px-6 py-3 text-center">16 - 18 cm</td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-[var(--bg)] text-[var(--text-secondary)] text-xs px-2 py-0.5 rounded-full">Standard Fit</span>
                </td>
              </tr>
              <tr className="bg-[var(--bg)]/50">
                <td className="px-6 py-3 font-medium text-[var(--text)]">16 - 18 cm</td>
                <td className="px-6 py-3 text-center">18 - 20 cm</td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-[var(--bg)] text-[var(--text-secondary)] text-xs px-2 py-0.5 rounded-full">Standard Fit</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-3 font-medium text-[var(--text)]">18 - 20 cm</td>
                <td className="px-6 py-3 text-center">18 - 22 cm</td>
                <td className="px-6 py-3 text-center">
                  <span className="inline-block bg-[var(--bg)] text-[var(--text-secondary)] text-xs px-2 py-0.5 rounded-full">Standard Fit</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[var(--text-muted)] mt-3">
          If your wrist measurement falls exactly on a boundary, choose the larger size range for a more comfortable fit.
        </p>
      </section>

      {/* Snug vs Loose */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">Snug Fit vs. Loose Fit</h2>
        <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
          Your personal preference plays a big role in finding the right bracelet size. Here is how to decide between a snug and loose fit:
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">Snug Fit</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Choose your exact wrist measurement for a closer, more fitted feel. The bracelet will stay in place with minimal movement.
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-1">+</span>
                <span>Ideal if you prefer a more secure feel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-1">+</span>
                <span>Better for stacking multiple bracelets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-1">+</span>
                <span>Less likely to catch on clothing or objects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--text-muted)] mt-1">-</span>
                <span>May feel restrictive in hot weather (wrists swell slightly)</span>
              </li>
            </ul>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">Loose Fit</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-3">
              Add 1-2 cm to your wrist measurement for a relaxed, flowing feel. The bracelet will slide freely and create a more casual look.
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-1">+</span>
                <span>Comfortable in all weather conditions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-1">+</span>
                <span>Natural, flowing movement on the wrist</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--success)] mt-1">+</span>
                <span>Easier to take on and off</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--text-muted)] mt-1">-</span>
                <span>May slide over the hand if too loose</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="mb-10">
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-4">Helpful Tips</h2>

        <div className="space-y-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">Bead size affects fit</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Bracelets with larger beads (10mm or more) will feel slightly tighter than the measured length suggests because the beads take up more circumference. If you are between sizes and ordering a large-bead bracelet, consider sizing up.
            </p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">Stretch bracelets have flexibility</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Our elastic stretch bracelets naturally accommodate a range of wrist sizes. The elastic cord provides approximately 1-2 cm of comfortable stretch, making them more forgiving than rigid bracelets.
            </p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">Wrist size changes throughout the day</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Your wrist can expand and contract due to temperature, activity level, and hydration. Measure your wrist at a neutral time (not after intense exercise or in extreme cold) for the most accurate reading.
            </p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-5">
            <h3 className="font-semibold text-[var(--text)] mb-2">When in doubt, size up</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              It is easier to wear a bracelet that is slightly loose than one that is too tight. A bracelet that is too small may be uncomfortable or break under tension. When choosing between two sizes, we recommend the larger one.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-lg p-8 text-center">
        <Ruler className="w-8 h-8 text-[var(--accent)] mx-auto mb-4" />
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">Still Not Sure About Your Size?</h2>
        <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
          Our support team is happy to help you find the right fit. Send us your wrist measurement and we will recommend the perfect size.
        </p>
        <a
          href="mailto:mythrealms@outlook.com"
          className="inline-flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[var(--primary-hover)] transition"
        >
          <Info className="w-4 h-4" />
          Ask About Sizing
        </a>
      </section>

    </div>
  );
}
