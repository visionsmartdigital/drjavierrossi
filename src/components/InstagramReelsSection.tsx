import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

// TODO: Replace with the 3 most recent reel URLs from
// https://www.instagram.com/drjavierrossi/reels/
const reelUrls: string[] = [
"https://www.instagram.com/crearestetica/reel/DdWdEsVR7jW/",
"https://www.instagram.com/crearestetica/reel/DdMD5gAJEt7/",
"https://www.instagram.com/tchangeargentina/reel/DdKQbUWPUJb/",
];

function ReelEmbed({ url }: { url: string }) {
  return (
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: "3px",
        boxShadow:
          "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
        margin: "1px",
        maxWidth: "540px",
        minWidth: "300px",
        padding: 0,
        width: "100%",
      }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    </blockquote>
  );
}

export function InstagramReelsSection() {
  const { t } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.instagram.com/embed.js"]'
    );
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <section id="instagram" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <span className="text-sm font-medium text-primary tracking-wide">
          Instagram
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-medium text-foreground">
          {t("Seguinos en Instagram", "Follow us on Instagram")}
        </h2>

        <div className="mt-10 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reelUrls.map((url, i) => (
                <div
                  key={i}
                  className="flex-[0_0_100%] md:flex-[0_0_33.3333%] min-w-0 px-3"
                >
                  <ReelEmbed url={url} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={t("Anterior", "Previous")}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>

            <div className="flex gap-2">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`${t("Ir al reel", "Go to reel")} ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === selectedIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={t("Siguiente", "Next")}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
