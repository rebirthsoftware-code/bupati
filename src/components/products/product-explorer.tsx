"use client";

import { useMemo, useState } from "react";
import { categories, products } from "@/data/products";
import { ProductCard } from "./product-card";
import { PawIcon } from "@/components/icons";

const petFilters = [
  { value: "all", label: "Hepsi", emoji: "🐾" },
  { value: "kedi", label: "Kedi", emoji: "🐱" },
  { value: "köpek", label: "Köpek", emoji: "🐶" },
  { value: "kuş", label: "Kuş", emoji: "🦜" },
  { value: "kemirgen", label: "Kemirgen", emoji: "🐹" },
];

const sorts = [
  { value: "default", label: "Önerilen" },
  { value: "price-asc", label: "Fiyat: Artan" },
  { value: "price-desc", label: "Fiyat: Azalan" },
  { value: "name", label: "İsme göre" },
];

export function ProductExplorer() {
  const [category, setCategory] = useState("hepsi");
  const [pet, setPet] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    let list = products.filter((p) => {
      const byCategory = category === "hepsi" || p.category === category;
      const byPet = pet === "all" || p.petType === pet || p.petType === "hepsi";
      const bySearch =
        !q ||
        p.name.toLocaleLowerCase("tr").includes(q) ||
        p.brand.toLocaleLowerCase("tr").includes(q) ||
        p.description.toLocaleLowerCase("tr").includes(q);
      return byCategory && byPet && bySearch;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, "tr"));

    return list;
  }, [category, pet, query, sort]);

  return (
    <div>
      {/* Filtreler */}
      <div className="card sticky top-[86px] z-20 p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden>
                🔍
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ürün, marka veya içerik ara…"
                aria-label="Ürün ara"
                className="field !pl-11"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sıralama"
              className="field sm:w-52"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {categories.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCategory(c.slug)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition ${
                  category === c.slug
                    ? "bg-mint-500 text-white shadow-soft"
                    : "bg-cream-100 text-ink-600 hover:bg-cream-200"
                }`}
              >
                <span className="mr-1" aria-hidden>
                  {c.emoji}
                </span>
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-cream-200 pt-3">
            <span className="text-xs font-bold text-ink-400">Dost tipi:</span>
            {petFilters.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPet(p.value)}
                className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition ${
                  pet === p.value
                    ? "border-mint-400 bg-mint-50 text-mint-700"
                    : "border-cream-200 text-ink-600 hover:border-mint-200"
                }`}
              >
                <span className="mr-1" aria-hidden>
                  {p.emoji}
                </span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-ink-400">
        {filtered.length} ürün listeleniyor
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-8 card flex flex-col items-center gap-3 p-12 text-center">
          <PawIcon className="h-12 w-12 text-mint-300" />
          <p className="font-display text-xl font-bold">Aradığınız ürünü bulamadık</p>
          <p className="max-w-sm text-sm text-ink-600">
            Filtreleri değiştirmeyi deneyin ya da WhatsApp'tan yazın; aradığınız ürünü sizin için temin edelim.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("hepsi");
              setPet("all");
              setQuery("");
            }}
            className="btn-ghost mt-2"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}
