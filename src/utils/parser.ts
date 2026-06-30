// Minimal "dieline" parser. A real implementation would detect panels in the
// PNG. For this challenge we use the uploaded image purely as a texture mapped
// across the box faces, while the panel geometry is canonical.

export interface ParsedDieline {
  imageUrl: string;
  width: number;
  height: number;
}

export function parseDielineFromImage(file: File): Promise<ParsedDieline> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be a PNG/JPG image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ imageUrl: url, width: img.width, height: img.height });
    };
    img.onerror = () => reject(new Error("Could not decode image"));
    img.src = url;
  });
}
