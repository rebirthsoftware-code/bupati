#!/usr/bin/env node
/**
 * GitHub Pages için statik site üretir.
 *
 * Sunucu gerektiren bölümler (canlı destek API'leri ve yönetim paneli) geçici
 * olarak kenara alınır, `next build` statik dışa aktarım modunda çalıştırılır,
 * ardından dosyalar yerine konur. Çıktı: out/
 *
 * Kullanım:  BASE_PATH=/bupati node scripts/build-static.mjs
 */
import { execSync } from "child_process";
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "fs";
import path from "path";

const root = process.cwd();
const stash = path.join(root, ".static-stash");
// Statik dışa aktarımda derlenemeyen, sunucu gerektiren yollar
const dynamicPaths = ["src/app/api", "src/app/admin"];

function move(from, to) {
  mkdirSync(path.dirname(to), { recursive: true });
  renameSync(from, to);
}

function stashDynamic() {
  rmSync(stash, { recursive: true, force: true });
  for (const rel of dynamicPaths) {
    const source = path.join(root, rel);
    if (existsSync(source)) move(source, path.join(stash, rel));
  }
}

function restoreDynamic() {
  for (const rel of dynamicPaths) {
    const saved = path.join(stash, rel);
    if (existsSync(saved)) move(saved, path.join(root, rel));
  }
  rmSync(stash, { recursive: true, force: true });
}

stashDynamic();
try {
  rmSync(path.join(root, "out"), { recursive: true, force: true });
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "1",
      NEXT_PUBLIC_STATIC_DEMO: "1",
    },
  });
  // GitHub Pages'in Jekyll işlemesini kapat (_next klasörü aksi hâlde yok sayılır)
  writeFileSync(path.join(root, "out", ".nojekyll"), "");
  console.log("\n✓ Statik site hazır: out/");
} finally {
  restoreDynamic();
}
