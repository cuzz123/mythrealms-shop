"use client";

import { useState } from "react";
import { X, Ruler } from "lucide-react";

export function SizeGuideModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs font-medium text-[var(--accent)] flex items-center gap-1 hover:underline"
      >
        <Ruler className="w-3.5 h-3.5" />
        Size Guide
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-[var(--surface)] rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-serif text-xl font-bold">
                Bracelet Size Guide
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--border-light)] rounded-full text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <h4 className="font-semibold mb-2">How to Measure Your Wrist</h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Wrap a flexible measuring tape or a strip of paper around your wrist
                  just below the wrist bone (where you would normally wear a bracelet).
                  Mark the overlap point, then measure the length with a ruler.
                </p>
              </div>

              <div className="bg-[var(--bg)] rounded-lg p-5">
                <h4 className="font-semibold mb-3">Size Recommendations</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-2 font-semibold">Wrist Circumference</th>
                      <th className="text-left py-2 font-semibold">Recommended Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--border-light)]">
                      <td className="py-2">14–16 cm (5.5–6.3 inch)</td>
                      <td className="py-2 font-medium">16–18 cm</td>
                    </tr>
                    <tr className="border-b border-[var(--border-light)]">
                      <td className="py-2">16–18 cm (6.3–7.1 inch)</td>
                      <td className="py-2 font-medium">18–20 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2">18–20 cm (7.1–7.9 inch)</td>
                      <td className="py-2 font-medium">18–22 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                <strong>Tip:</strong> If you prefer a looser fit, choose one size up.
                For a snug fit, choose your exact measurement.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
