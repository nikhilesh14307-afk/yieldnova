import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold">Field not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page hasn't been planted yet.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AgriSmart — AI Crop Yield Prediction & Optimization" },
      { name: "description", content: "Predict crop yield, get smart recommendations, detect diseases, and optimize fertilizer using AI." },
      { property: "og:title", content: "AgriSmart — AI Crop Yield Prediction & Optimization" },
      { name: "twitter:title", content: "AgriSmart — AI Crop Yield Prediction & Optimization" },
      { property: "og:description", content: "Predict crop yield, get smart recommendations, detect diseases, and optimize fertilizer using AI." },
      { name: "twitter:description", content: "Predict crop yield, get smart recommendations, detect diseases, and optimize fertilizer using AI." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Q8Us3rjlzleVOMP03Pi41aKR7pp1/social-images/social-1780556300079-leaves.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/Q8Us3rjlzleVOMP03Pi41aKR7pp1/social-images/social-1780556300079-leaves.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster richColors position="top-right" />
    </div>
  );
}
