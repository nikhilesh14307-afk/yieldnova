import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-fields.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sprout, CloudSun, FlaskConical, ScanLine, MessageCircle, BarChart3, Leaf, MapPin } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriSmart Dashboard — AI Crop Yield Insights" },
      { name: "description", content: "Real-time agricultural intelligence: yield predictions, weather, and crop recommendations." },
    ],
  }),
  component: Dashboard,
});

const yieldTrend = [
  { year: "2019", wheat: 3.1, rice: 4.2, maize: 4.8 },
  { year: "2020", wheat: 3.3, rice: 4.4, maize: 5.0 },
  { year: "2021", wheat: 3.5, rice: 4.6, maize: 5.3 },
  { year: "2022", wheat: 3.4, rice: 4.5, maize: 5.5 },
  { year: "2023", wheat: 3.7, rice: 4.8, maize: 5.7 },
  { year: "2024", wheat: 3.9, rice: 5.0, maize: 6.0 },
];

const regionYield = [
  { region: "Punjab", yield: 4.6 },
  { region: "Iowa", yield: 5.8 },
  { region: "Bavaria", yield: 4.1 },
  { region: "São Paulo", yield: 5.2 },
  { region: "Henan", yield: 4.9 },
];

const features = [
  { icon: Sprout, title: "Yield Prediction", desc: "ML-powered predictions in tons/hectare with confidence scoring.", to: "/predict" },
  { icon: Leaf, title: "Smart Recommendations", desc: "Top 3 crops tailored to your soil, weather and season.", to: "/recommend" },
  { icon: ScanLine, title: "Disease Detection", desc: "Upload a leaf image — AI identifies issues instantly.", to: "/disease" },
  { icon: MessageCircle, title: "AI Assistant", desc: "Chat with an agronomist powered by Lovable AI.", to: "/chat" },
  { icon: FlaskConical, title: "Fertilizer Optimizer", desc: "Right blend, right amount — eco-conscious dosing.", to: "/predict" },
  { icon: CloudSun, title: "Weather & Alerts", desc: "Drought, heatwave & rainfall risk warnings.", to: "/predict" },
];

function Dashboard() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Aerial view of green agricultural fields" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> AI for sustainable agriculture
            </span>
            <h1 className="mt-5 font-display text-5xl sm:text-6xl font-semibold leading-[1.05]">
              Grow smarter,<br />
              <span className="text-primary">harvest more.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              AgriSmart blends machine learning, real-world weather data, and agronomic science to predict yield and prescribe optimal action — for every field, every season.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-[var(--shadow-glow)]">
                <Link to="/predict">Predict Yield</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/recommend">Recommend Crops</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { v: "4.8 t/ha", l: "Avg. predicted yield" },
            { v: "92%", l: "Model confidence" },
            { v: "8", l: "Crop varieties" },
            { v: "-23%", l: "Fertilizer waste" },
          ].map((s) => (
            <Card key={s.l} className="p-5 bg-[image:var(--gradient-card)] border-border/60">
              <div className="font-display text-2xl sm:text-3xl font-semibold text-primary">{s.v}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">Everything your field needs</h2>
            <p className="text-muted-foreground mt-2">A modular toolkit for modern farmers and researchers.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="group">
              <Card className="p-6 h-full transition-all hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 border-border/60">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CHARTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        <div className="grid lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Historical yield trends (t/ha)</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="wheat" stroke="var(--chart-3)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="rice" stroke="var(--chart-2)" strokeWidth={2.5} dot={false} />
                  <Line type="monotone" dataKey="maize" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <h3 className="font-display text-lg font-semibold">Regional avg yield (2024)</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionYield}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="region" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="yield" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
