import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
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
      { title: "Dr. Javier Rossi — Cirugía Facial Especializada" },
      { name: "description", content: "Cirujano facial especializado en Buenos Aires. Doctor UBA. +25 años de experiencia. FFS, rejuvenecimiento y cirugía estética ósea facial." },
      { name: "author", content: "Dr. Javier Rossi" },
      { property: "og:title", content: "Dr. Javier Rossi — Cirugía Facial Especializada" },
      { name: "twitter:title", content: "Dr. Javier Rossi — Cirugía Facial Especializada" },
      { property: "og:description", content: "Cirujano facial especializado en Buenos Aires. Doctor UBA. +25 años de experiencia. FFS, rejuvenecimiento y cirugía estética ósea facial." },
      { name: "twitter:description", content: "Cirujano facial especializado en Buenos Aires. Doctor UBA. +25 años de experiencia. FFS, rejuvenecimiento y cirugía estética ósea facial." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7wq5vzvXNPc7aHiaRGY3zvcTWt73/social-images/social-1778765727198-magnific__background__77233.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7wq5vzvXNPc7aHiaRGY3zvcTWt73/social-images/social-1778765727198-magnific__background__77233.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" },
    ],
    scripts: [
      {
        children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5CK2F5S4');`,
      },
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5CK2F5S4"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
