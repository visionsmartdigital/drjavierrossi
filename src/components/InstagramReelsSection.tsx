import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import reel1 from "@/assets/reel-1.jpg";
import reel2 from "@/assets/reel-2.jpg";
import reel3 from "@/assets/reel-3.jpg";

const reels = [
  { image: reel1, url: "https://www.instagram.com/crearestetica/reel/DdWdEsVR7jW/" },
  { image: reel2, url: "https://www.instagram.com/crearestetica/reel/DdMD5gAJEt7/" },
  { image: reel3, url: "https://www.instagram.com/tchangeargentina/reel/DdKQbUWPUJb/" },
];

export function InstagramReelsSection() {
  const { t } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, slidesToScroll: 1 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => { setScrollSnaps(emblaApi.scrollSnapList()); onSelect(); });
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section id="instagram" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <span className="text-sm font-medium text-primary tracking-wide">Instagram</span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-medium text-foreground">
          {t("Seguinos en Instagram", "Follow us on Instagram")}
        </h2>
        <div className="mt-10 relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reels.map((reel, i) => (
                <div key={i} className="flex-[0_0_100%] md:flex-[0_0_33.3333%] min-w-0 px-3">
                  <a href={reel.url} target="_blank" rel="noopener noreferrer" className="block relative group rounded-lg overflow-hidden">
                    <img src={reel.image} alt={`Reel ${i + 1}`} className="w-full aspect-[9/16] object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white rounded-full p-4">
                        <Play className="w-8 h-8 text-primary fill-primary" />
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button type="button" onClick={() => emblaApi?.scrollPrev()} aria-label={t("Anterior", "Previous")} className="p-2 rounded-full border border-border hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex gap-2">
              {scrollSnaps.map((_, i) => (
                <button key={i} type="button" onClick={() => emblaApi?.scrollTo(i)} className={`h-2 rounded-full transition-all ${i === selectedIndex ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`} />
              ))}
            </div>
            <button type="button" onClick={() => emblaApi?.scrollNext()} aria-label={t("Siguiente", "Next")} className="p-2 rounded-full border border-border hover:bg-muted transition-colors">
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
