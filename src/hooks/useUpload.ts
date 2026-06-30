import { useCallback, useState } from "react";
import { parseDielineFromImage, type ParsedDieline } from "@/utils/parser";

export function useUpload() {
  const [dieline, setDieline] = useState<ParsedDieline | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(async (file: File | null | undefined) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const result = await parseDielineFromImage(file);
      setDieline((prev) => {
        // Free previous object URL to avoid leaks
        if (prev) URL.revokeObjectURL(prev.imageUrl);
        return result;
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load image");
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setDieline((prev) => {
      if (prev) URL.revokeObjectURL(prev.imageUrl);
      return null;
    });
    setError(null);
  }, []);

  return { dieline, error, loading, handleFile, clear };
}
