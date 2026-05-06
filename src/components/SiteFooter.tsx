export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/30 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 text-sm text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} AgriSmart — Cultivating data, growing yields.</p>
        <p className="font-display italic">Sown with care 🌱</p>
      </div>
    </footer>
  );
}
