import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { recommendCrops, SOILS, type SoilType } from "@/lib/agri";
import { Leaf, Sparkles } from "lucide-react";

export const Route = createFileRoute("/recommend")({
  head: () => ({ meta: [{ title: "Crop Recommendations — AgriSmart" }, { name: "description", content: "Get top crop recommendations from soil, weather, and season." }] }),
  component: RecommendPage,
});

const REASONS: Record<string, string> = {
  wheat: "Thrives in cool seasons with moderate rainfall and well-drained loamy soils.",
  rice: "Loves warm temperatures and high water availability — ideal for clay soils & monsoons.",
  maize: "Versatile, high-yielding cereal that performs well in warm summers with steady moisture.",
  soybean: "Nitrogen-fixing legume, great rotation crop, prefers warm, moderately wet conditions.",
  cotton: "Heat-loving fiber crop, resilient on sandy/loamy soils with long warm seasons.",
  sugarcane: "High-water tropical crop, enormous yield potential in warm, humid regions.",
  barley: "Cold-hardy cereal, tolerates poor soils, short growing season.",
  millet: "Drought-resistant smart grain — ideal for arid and low-input systems.",
};

function RecommendPage() {
  const [soil, setSoil] = useState<SoilType>("loamy");
  const [temperature, setTemperature] = useState(24);
  const [rainfall, setRainfall] = useState(800);
  const [humidity, setHumidity] = useState(65);
  const [season, setSeason] = useState<"spring" | "summer" | "monsoon" | "autumn" | "winter">("summer");
  const [results, setResults] = useState<{ crop: string; score: number }[]>([]);

  const onRecommend = () => {
    setResults(recommendCrops({ soil, temperature, rainfall, humidity, season }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold">Smart Crop Recommendations</h1>
        <p className="text-muted-foreground mt-2">Tell us about your land and season — we'll suggest the top 3 crops to plant.</p>
      </header>
      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Soil type</Label>
              <Select value={soil} onValueChange={(v) => setSoil(v as SoilType)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{SOILS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Season</Label>
              <Select value={season} onValueChange={(v) => setSeason(v as typeof season)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["spring", "summer", "monsoon", "autumn", "winter"].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Temp (°C)</Label><Input type="number" className="mt-1.5" value={temperature} onChange={(e) => setTemperature(+e.target.value)} /></div>
            <div><Label>Humidity (%)</Label><Input type="number" className="mt-1.5" value={humidity} onChange={(e) => setHumidity(+e.target.value)} /></div>
            <div className="col-span-2"><Label>Rainfall (mm)</Label><Input type="number" className="mt-1.5" value={rainfall} onChange={(e) => setRainfall(+e.target.value)} /></div>
          </div>
          <Button onClick={onRecommend} size="lg" className="w-full mt-6 shadow-[var(--shadow-glow)]">
            <Sparkles className="h-4 w-4 mr-2" /> Recommend crops
          </Button>
        </Card>

        <div className="lg:col-span-3 space-y-3">
          {results.length === 0 ? (
            <Card className="p-10 text-center border-dashed text-muted-foreground">
              <Leaf className="h-12 w-12 mx-auto text-primary/40" />
              <p className="mt-3">Your top 3 recommended crops will appear here.</p>
            </Card>
          ) : (
            results.map((r, i) => (
              <Card key={r.crop} className="p-6 flex items-start gap-4 hover:shadow-[var(--shadow-soft)] transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-semibold capitalize">{r.crop}</h3>
                    <span className="text-sm font-medium text-primary">Match {(r.score * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{REASONS[r.crop]}</p>
                  <div className="mt-3 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${r.score * 100}%` }} />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
