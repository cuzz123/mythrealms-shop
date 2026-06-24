"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

const STONES = [
  "Amethyst", "Rose Quartz", "Black Obsidian", "Moonstone", "Tiger's Eye",
  "Jade", "Lapis Lazuli", "Hematite", "Agate", "Lava Rock", "Red String",
];

const INTENTIONS = [
  "Protection", "Wealth & Luck", "Love & Healing",
  "Meditation", "Chakra Balance",
];

const MATERIALS = [
  "Leather", "Silver 925", "Copper", "Wood", "Red String",
  "Gemstone", "Jade",
];

export function CollectionFilters({ initialCounts }: { initialCounts?: { stones?: Record<string,number>; intentions?: Record<string,number>; materials?: Record<string,number> } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const counts = initialCounts || { stones: {}, intentions: {}, materials: {} };
  const [selectedStones, setSelectedStones] = useState<string[]>(
    searchParams.get("stone")?.split(",").filter(Boolean) || []
  );
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>(
    searchParams.get("intention")?.split(",").filter(Boolean) || []
  );
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(
    searchParams.get("material")?.split(",").filter(Boolean) || []
  );
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");

  function toggleValue(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (selectedStones.length) params.set("stone", selectedStones.join(","));
    else params.delete("stone");

    if (selectedIntentions.length) params.set("intention", selectedIntentions.join(","));
    else params.delete("intention");

    if (selectedMaterials.length) params.set("material", selectedMaterials.join(","));
    else params.delete("material");

    if (priceMin) params.set("priceMin", priceMin);
    else params.delete("priceMin");

    if (priceMax) params.set("priceMax", priceMax);
    else params.delete("priceMax");

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  }

  function clearAll() {
    setSelectedStones([]);
    setSelectedIntentions([]);
    setSelectedMaterials([]);
    setPriceMin("");
    setPriceMax("");
    router.push(pathname);
    setIsOpen(false);
  }

  const activeCount =
    selectedStones.length + selectedIntentions.length + selectedMaterials.length +
    (priceMin ? 1 : 0) + (priceMax ? 1 : 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border)] rounded-full text-sm font-medium text-[var(--text-secondary)] hover:border-[var(--text-muted)] transition relative"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filter
        {activeCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] bg-black/40 animate-fade-in" onClick={() => setIsOpen(false)}>
          <div
            className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-[var(--surface)] z-[201] shadow-2xl animate-slide-in-right overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[var(--surface)] z-10 flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-serif text-lg font-bold">Filters</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-[var(--border-light)] rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Stone Type */}
              <FilterGroup title="Stone Type">
                {STONES.map((s) => (
                  <FilterCheckbox
                    key={s}
                    label={s}
                    count={counts.stones?.[s] || 0}
                    checked={selectedStones.includes(s)}
                    onChange={() => setSelectedStones(toggleValue(selectedStones, s))}
                  />
                ))}
              </FilterGroup>

              {/* Intention */}
              <FilterGroup title="Intention">
                {INTENTIONS.map((s) => (
                  <FilterCheckbox
                    key={s}
                    label={s}
                    count={counts.intentions?.[s] || 0}
                    checked={selectedIntentions.includes(s)}
                    onChange={() => setSelectedIntentions(toggleValue(selectedIntentions, s))}
                  />
                ))}
              </FilterGroup>

              {/* Material */}
              <FilterGroup title="Material">
                {MATERIALS.map((s) => (
                  <FilterCheckbox
                    key={s}
                    label={s}
                    count={counts.materials?.[s] || 0}
                    checked={selectedMaterials.includes(s)}
                    onChange={() => setSelectedMaterials(toggleValue(selectedMaterials, s))}
                  />
                ))}
              </FilterGroup>

              {/* Price Range */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-3">
                  Price Range
                </h4>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm"
                  />
                  <span className="text-[var(--text-muted)] text-sm">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] p-5 flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 py-3 rounded-full border border-[var(--border)] text-sm font-medium hover:bg-[var(--border-light)] transition"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 rounded-full bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-3">
        {title}
      </h4>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer text-sm text-[var(--text-secondary)] hover:text-[var(--text)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded accent-[var(--accent)]"
      />
      {label}
      {count !== undefined && count > 0 && (
        <span className="text-[10px] text-[var(--text-muted)] ml-auto">{count}</span>
      )}
    </label>
  );
}
