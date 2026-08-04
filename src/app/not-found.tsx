import Link from "next/link";
import { PawIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-mint-100 to-cream-50 px-5 text-center">
      <div className="paw-pattern absolute inset-0 opacity-60" aria-hidden />
      <div className="relative">
        <span className="text-7xl" aria-hidden>
          🐾
        </span>
        <h1 className="mt-4 font-display text-5xl font-extrabold">404</h1>
        <p className="mt-3 max-w-md text-ink-600">
          Bu sayfayı bulamadık — galiba minik bir pati onu saklamış. Ana sayfadan devam edelim mi?
        </p>
        <Link href="/" className="btn-primary mt-8">
          <PawIcon className="h-4 w-4" />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
