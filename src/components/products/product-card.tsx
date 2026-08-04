import { formatPrice, type Product } from "@/data/products";
import { site, whatsappLink } from "@/data/site";
import { PawIcon, WhatsAppIcon } from "@/components/icons";

const badgeStyles: Record<string, string> = {
  "Çok Satan": "bg-coral-400 text-white",
  Yeni: "bg-mint-500 text-white",
  İndirimli: "bg-coral-500 text-white",
  "Veteriner Önerisi": "bg-ink-900 text-cream-100",
};

export function ProductCard({ product }: { product: Product }) {
  const message = `Merhaba ${site.shortName}, "${product.name}" ürününü sipariş etmek istiyorum. (Fiyat: ${formatPrice(
    product.price
  )})`;

  return (
    <article className="group card flex h-full flex-col overflow-hidden p-0 transition duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${product.gradient}`}>
        <PawIcon className="absolute -right-4 -top-4 h-20 w-20 text-white/40" />
        <PawIcon className="absolute -bottom-5 -left-3 h-16 w-16 text-white/30" />
        <span className="relative text-6xl transition duration-300 group-hover:scale-110" aria-hidden>
          {product.emoji}
        </span>
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
              badgeStyles[product.badge]
            }`}
          >
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-ink-600">
            Stokta yok
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-mint-600">{product.brand}</p>
        <h3 className="mt-1 text-base font-bold leading-snug">{product.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{product.description}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {product.details.slice(0, 3).map((d) => (
            <li key={d} className="rounded-full bg-cream-100 px-2.5 py-1 text-[11px] font-semibold text-ink-600">
              {d}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            {product.oldPrice && (
              <span className="block text-xs font-semibold text-ink-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-display text-2xl font-extrabold text-ink-900">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-whatsapp mt-4 w-full !px-4 !text-xs ${product.inStock ? "" : "pointer-events-none opacity-50"}`}
          aria-disabled={!product.inStock}
        >
          <WhatsAppIcon className="h-4 w-4" />
          {product.inStock ? "WhatsApp'tan Sipariş Ver" : "Stok Bekleniyor"}
        </a>
      </div>
    </article>
  );
}
