import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { UploadPanel } from "@/components/UploadPanel";
import { Controls } from "@/components/Controls";
import { ThreeScene } from "@/components/ThreeScene";
import { useAnimation } from "@/hooks/useAnimation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "2D Dieline → 3D Box Builder" },
      {
        name: "description",
        content:
          "Upload a 2D box dieline and watch it fold into a 3D box with smooth Three.js animation.",
      },
      { property: "og:title", content: "2D Dieline → 3D Box Builder" },
      {
        property: "og:description",
        content:
          "Convert flat box dielines into animated, foldable 3D boxes in the browser.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const progress = useAnimation((s) => s.progress);
  const playing = useAnimation((s) => s.playing);

  const onUpload = useCallback((url: string | null) => {
    setTextureUrl(url);
  }, []);

  const status = playing
    ? `Folding… ${Math.round(progress * 100)}%`
    : progress === 0
    ? "Flat dieline — press Fold to assemble"
    : progress >= 1
    ? "Box closed ✔  (auto-rotating)"
    : `Paused at ${Math.round(progress * 100)}%`;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-border bg-background/60 px-6 py-4 backdrop-blur">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          2D Dieline → 3D Box Builder
        </h1>
        <p className="text-xs text-muted-foreground">
          Upload a PNG dieline. Press Fold. Watch each panel rotate around its crease.
        </p>
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
        {/* Left panel */}
        <aside className="w-full shrink-0 space-y-4 md:w-80">
          <UploadPanel onUpload={onUpload} />
          <div className="rounded-lg border border-border bg-card p-4">
            <Controls />
          </div>
        </aside>

        {/* Right panel — Three.js canvas */}
        <section
          id="scene-wrap"
          className="relative flex-1 overflow-hidden rounded-lg border border-border bg-white shadow-sm"
          style={{ minHeight: "60vh" }}
        >
          <ThreeScene textureUrl={textureUrl} />
        </section>
      </main>

      <footer className="border-t border-border bg-background/60 px-6 py-2 text-center text-xs text-muted-foreground">
        {status}
      </footer>
    </div>
  );
}
