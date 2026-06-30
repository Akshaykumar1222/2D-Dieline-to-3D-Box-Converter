import { Play, RotateCcw, Repeat, Camera, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useAnimation } from "@/hooks/useAnimation";

export function Controls() {
  const { progress, playing, speed, fold, reset, replay, setSpeed, setProgress } =
    useAnimation();

  const onScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const url = (canvas as HTMLCanvasElement).toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "box-3d.png";
    a.click();
  };

  const onFullscreen = () => {
    const el = document.getElementById("scene-wrap");
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={fold} disabled={playing || progress >= 1}>
          <Play className="mr-1 h-4 w-4" /> Fold
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="mr-1 h-4 w-4" /> Reset
        </Button>
        <Button variant="secondary" onClick={replay}>
          <Repeat className="mr-1 h-4 w-4" /> Replay
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Animation speed</Label>
          <span className="text-xs text-muted-foreground">{speed.toFixed(2)}×</span>
        </div>
        <Slider
          value={[speed]}
          min={0.25}
          max={3}
          step={0.05}
          onValueChange={([v]) => setSpeed(v)}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Fold progress</Label>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress * 100)}%
          </span>
        </div>
        <Slider
          value={[progress]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={([v]) => setProgress(v)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={onScreenshot}>
          <Camera className="mr-1 h-4 w-4" /> Screenshot
        </Button>
        <Button variant="outline" size="sm" onClick={onFullscreen}>
          <Maximize2 className="mr-1 h-4 w-4" /> Fullscreen
        </Button>
      </div>
    </div>
  );
}
