import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { PawIntro } from "@/components/paw-intro";
import { RevealProvider } from "@/components/reveal-provider";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* JavaScript kapalıysa kaydırmayla beliren bölümler gizli kalmasın */}
      <noscript>
        <style>{`[data-reveal]{opacity:1 !important;translate:none !important}`}</style>
      </noscript>
      <PawIntro />
      <RevealProvider />
      <SiteHeader />
      <main id="icerik">{children}</main>
      <SiteFooter />
      <ChatWidget />
    </>
  );
}
