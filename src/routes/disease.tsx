import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanLine, Upload, Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/disease")({
  head: () => ({ meta: [{ title: "Crop Disease Detection — AgriSmart" }, { name: "description", content: "Upload a leaf image and let AI identify diseases and remedies." }] }),
  component: DiseasePage,
});

const analyzeImage = createServerFn({ method: "POST" })
  .inputValidator((d: { imageBase64: string }) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a plant pathologist. Inspect the crop leaf image and respond with: 1) Likely disease (or 'Healthy'), 2) Confidence %, 3) Symptoms observed, 4) Recommended treatment (organic & chemical), 5) Prevention. Use short markdown sections." },
          { role: "user", content: [
            { type: "text", text: "Analyze this crop leaf for diseases." },
            { type: "image_url", image_url: { url: data.imageBase64 } },
          ]},
        ],
      }),
    });
    if (res.status === 429) throw new Error("Rate limited — try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in workspace settings.");
    if (!res.ok) throw new Error(`AI error ${res.status}`);
    const json = await res.json();
    return { analysis: json.choices?.[0]?.message?.content ?? "No response." };
  });

function DiseasePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
    setAnalysis(null);
  };

  const onAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const r = await analyzeImage({ data: { imageBase64: preview } });
      setAnalysis(r.analysis);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold flex items-center gap-3">
          <ScanLine className="h-8 w-8 text-primary" /> Crop Disease Detection
        </h1>
        <p className="text-muted-foreground mt-2">Upload a clear photo of a plant leaf — AI vision will identify symptoms and prescribe remedies.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <label className="block">
            <div className="border-2 border-dashed border-border rounded-2xl aspect-[4/3] flex items-center justify-center overflow-hidden bg-muted/30 cursor-pointer hover:border-primary transition-colors">
              {preview ? (
                <img src={preview} alt="Crop leaf preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground p-6">
                  <Upload className="h-10 w-10 mx-auto text-primary/60" />
                  <p className="mt-3 font-medium">Click to upload a leaf image</p>
                  <p className="text-xs">JPG, PNG up to a few MB</p>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
          </label>
          <Button onClick={onAnalyze} disabled={!preview || loading} size="lg" className="w-full mt-4 shadow-[var(--shadow-glow)]">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</> : <><Leaf className="h-4 w-4 mr-2" /> Detect disease</>}
          </Button>
        </Card>

        <Card className="p-6 min-h-[300px]">
          <h3 className="font-display text-xl font-semibold mb-3">Diagnosis</h3>
          {analysis ? (
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">{analysis}</div>
          ) : (
            <p className="text-muted-foreground text-sm">Upload an image and run analysis to see the diagnosis here.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
