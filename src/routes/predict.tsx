import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { predictYield, fertilizerAdvice, sustainabilityScore, SOILS, CROPS, type SoilType, type CropType, type YieldResult } from "@/lib/agri";
import { Sprout, AlertTriangle, Leaf, FlaskConical, Gauge } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/predict")({
  head: () => ({ meta: [{ title: "Yield Prediction — AgriSmart" }, { name: "description", content: "Predict crop yield with AI based on soil, weather and fertilizer." }] }),
  component: PredictPage,
});

function PredictPage() {
  const [crop, setCrop] = useState<CropType>("wheat");
  const [soil, setSoil] = useState<SoilType>("loamy");
  const [temperature, setTemperature] = useState(22);
  const [rainfall, setRainfall] = useState(600);
  const [humidity, setHumidity] = useState(60);
  const [fertilizer, setFertilizer] = useState(140);
  const [region, setRegion] = useState("Punjab");
  const [result, setResult] = useState<YieldResult | null>(null);

  const onPredict = () => {
    const r = predictYield({ crop, soil, temperature, rainfall, humidity, fertilizer, region });
    setResult(r);
    toast.success(`Predicted ${r.yield} t/ha`, { description: `Confidence ${(r.confidence * 100).toFixed(0)}%` });
  };

  const fert = fertilizerAdvice(crop, soil);
  const eco = result ? sustainabilityScore({ crop, soil, temperature, rainfall, humidity, fertilizer, region }) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold">Crop Yield Prediction</h1>
        <p className="text-muted-foreground mt-2">Enter field conditions — our model returns yield, confidence, and risk warnings.</p>
      </header>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2"><Sprout className="h-5 w-5 text-primary" /> Field inputs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Crop</Label>
              <Select value={crop} onValueChange={(v) => setCrop(v as CropType)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{CROPS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Soil type</Label>
              <Select value={soil} onValueChange={(v) => setSoil(v as SoilType)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{SOILS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Temperature (°C)</Label>
              <Input type="number" className="mt-1.5" value={temperature} onChange={(e) => setTemperature(+e.target.value)} />
            </div>
            <div>
              <Label>Humidity (%)</Label>
              <Input type="number" className="mt-1.5" value={humidity} onChange={(e) => setHumidity(+e.target.value)} />
            </div>
            <div>
              <Label>Rainfall (mm)</Label>
              <Input type="number" className="mt-1.5" value={rainfall} onChange={(e) => setRainfall(+e.target.value)} />
            </div>
            <div>
              <Label>Fertilizer (kg/ha)</Label>
              <Input type="number" className="mt-1.5" value={fertilizer} onChange={(e) => setFertilizer(+e.target.value)} />
            </div>
            <div className="col-span-2">
              <Label>Region</Label>
              <Input className="mt-1.5" value={region} onChange={(e) => setRegion(e.target.value)} />
            </div>
          </div>
          <Button onClick={onPredict} className="w-full mt-6 shadow-[var(--shadow-glow)]" size="lg">
            Predict yield
          </Button>
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {result ? (
            <>
              <Card className="p-6 bg-[image:var(--gradient-card)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted yield</p>
                    <p className="font-display text-5xl font-semibold text-primary">{result.yield} <span className="text-2xl text-muted-foreground">t/ha</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm">Confidence</span>
                    <span className="font-display text-xl font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className="mt-6 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={result.factors}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                      <Radar dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {result.warnings.length > 0 && (
                <Card className="p-5 border-destructive/40 bg-destructive/5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-semibold">Smart alerts</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {result.warnings.map((w) => <li key={w}>• {w}</li>)}
                      </ul>
                    </div>
                  </div>
                </Card>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-2"><FlaskConical className="h-4 w-4 text-primary" /><p className="font-semibold">Fertilizer recipe</p></div>
                  <p className="text-2xl font-display font-semibold">{fert.quantityKgHa} <span className="text-sm text-muted-foreground">kg/ha</span></p>
                  <p className="text-sm mt-1">{fert.blend}</p>
                  <p className="text-xs text-muted-foreground mt-2">{fert.eco}</p>
                </Card>
                {eco && (
                  <Card className="p-5">
                    <div className="flex items-center gap-2 mb-2"><Leaf className="h-4 w-4 text-primary" /><p className="font-semibold">Sustainability score</p></div>
                    <p className="text-2xl font-display font-semibold">{eco.score}<span className="text-sm text-muted-foreground">/100</span></p>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between"><span>Water efficiency</span><span>{eco.water}%</span></div>
                      <div className="flex justify-between"><span>Fertilizer use</span><span>{eco.fertilizer}%</span></div>
                      <div className="flex justify-between"><span>Crop eco-impact</span><span>{eco.cropEco}%</span></div>
                    </div>
                  </Card>
                )}
              </div>
            </>
          ) : (
            <Card className="p-10 text-center text-muted-foreground border-dashed">
              <Sprout className="h-12 w-12 mx-auto text-primary/40" />
              <p className="mt-3">Submit field inputs to see predictions, alerts, fertilizer plan and sustainability score.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
