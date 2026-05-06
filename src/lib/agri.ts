// Deterministic feature-weighted yield model — emulates a trained Random Forest
// using domain-tuned coefficients per crop. Outputs tons/hectare + confidence.

export type SoilType = "loamy" | "clay" | "sandy" | "silty" | "peaty" | "chalky";
export type CropType = "wheat" | "rice" | "maize" | "soybean" | "cotton" | "sugarcane" | "barley" | "millet";

export interface YieldInput {
  crop: CropType;
  soil: SoilType;
  temperature: number; // °C
  rainfall: number; // mm
  humidity: number; // %
  fertilizer: number; // kg/ha
  region: string;
}

interface CropProfile {
  base: number; // tons/ha baseline
  optTemp: number;
  optRain: number;
  optHumidity: number;
  optFert: number;
  soilAffinity: Partial<Record<SoilType, number>>;
}

const PROFILES: Record<CropType, CropProfile> = {
  wheat:    { base: 3.4, optTemp: 18, optRain: 550, optHumidity: 55, optFert: 140, soilAffinity: { loamy: 1.1, clay: 1.05, silty: 1.0, sandy: 0.85 } },
  rice:     { base: 4.6, optTemp: 27, optRain: 1500, optHumidity: 80, optFert: 160, soilAffinity: { clay: 1.15, loamy: 1.05, peaty: 1.0, sandy: 0.7 } },
  maize:    { base: 5.1, optTemp: 24, optRain: 700, optHumidity: 65, optFert: 180, soilAffinity: { loamy: 1.15, silty: 1.05, sandy: 0.9 } },
  soybean:  { base: 2.8, optTemp: 25, optRain: 650, optHumidity: 70, optFert: 90, soilAffinity: { loamy: 1.1, silty: 1.05, clay: 0.95 } },
  cotton:   { base: 2.2, optTemp: 28, optRain: 800, optHumidity: 60, optFert: 130, soilAffinity: { loamy: 1.1, sandy: 1.0, clay: 0.9 } },
  sugarcane:{ base: 65,  optTemp: 27, optRain: 1600, optHumidity: 75, optFert: 220, soilAffinity: { loamy: 1.1, clay: 1.05, silty: 1.0 } },
  barley:   { base: 3.0, optTemp: 16, optRain: 500, optHumidity: 55, optFert: 120, soilAffinity: { loamy: 1.1, chalky: 1.05, clay: 1.0 } },
  millet:   { base: 1.8, optTemp: 28, optRain: 400, optHumidity: 50, optFert: 70, soilAffinity: { sandy: 1.1, loamy: 1.05, chalky: 1.0 } },
};

const gauss = (x: number, mu: number, sigma: number) =>
  Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));

export interface YieldResult {
  yield: number; // tons/ha
  confidence: number; // 0-1
  factors: { label: string; score: number }[];
  warnings: string[];
}

export function predictYield(input: YieldInput): YieldResult {
  const p = PROFILES[input.crop];
  const tempScore = gauss(input.temperature, p.optTemp, 6);
  const rainScore = gauss(input.rainfall, p.optRain, p.optRain * 0.4);
  const humScore = gauss(input.humidity, p.optHumidity, 18);
  const fertScore = gauss(input.fertilizer, p.optFert, p.optFert * 0.5);
  const soilMul = p.soilAffinity[input.soil] ?? 0.8;

  const env = (tempScore * 0.3 + rainScore * 0.3 + humScore * 0.2 + fertScore * 0.2);
  const predicted = p.base * soilMul * (0.5 + env * 0.9);

  const warnings: string[] = [];
  if (input.rainfall < p.optRain * 0.5) warnings.push("Drought risk — consider supplemental irrigation.");
  if (input.rainfall > p.optRain * 1.6) warnings.push("Excess rainfall — monitor for waterlogging & fungal disease.");
  if (input.fertilizer > p.optFert * 1.6) warnings.push("Fertilizer overuse — risk of soil acidification & runoff.");
  if (input.temperature > p.optTemp + 8) warnings.push("Heat stress likely — schedule irrigation at dawn/dusk.");

  const confidence = Math.min(0.97, 0.55 + env * 0.45);

  return {
    yield: Number(predicted.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
    factors: [
      { label: "Temperature fit", score: Number(tempScore.toFixed(2)) },
      { label: "Rainfall fit", score: Number(rainScore.toFixed(2)) },
      { label: "Humidity fit", score: Number(humScore.toFixed(2)) },
      { label: "Fertilizer fit", score: Number(fertScore.toFixed(2)) },
      { label: "Soil affinity", score: Number(soilMul.toFixed(2)) },
    ],
    warnings,
  };
}

export interface RecommendInput {
  soil: SoilType;
  temperature: number;
  rainfall: number;
  humidity: number;
  season: "spring" | "summer" | "monsoon" | "autumn" | "winter";
}

export function recommendCrops(input: RecommendInput) {
  const crops = Object.keys(PROFILES) as CropType[];
  const scored = crops.map((c) => {
    const p = PROFILES[c];
    const tempScore = gauss(input.temperature, p.optTemp, 6);
    const rainScore = gauss(input.rainfall, p.optRain, p.optRain * 0.5);
    const humScore = gauss(input.humidity, p.optHumidity, 18);
    const soilMul = p.soilAffinity[input.soil] ?? 0.7;
    const score = (tempScore * 0.35 + rainScore * 0.35 + humScore * 0.3) * soilMul;
    return { crop: c, score: Number(score.toFixed(3)) };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

export function fertilizerAdvice(crop: CropType, soil: SoilType) {
  const p = PROFILES[crop];
  const soilFactor = (p.soilAffinity[soil] ?? 0.8);
  const qty = Math.round(p.optFert / soilFactor);
  const npk =
    crop === "rice" ? "Urea 60% + DAP 25% + MOP 15%" :
    crop === "wheat" ? "Urea 50% + DAP 30% + MOP 20%" :
    crop === "soybean" ? "DAP 50% + MOP 30% + Urea 20%" :
    "Balanced NPK 14-14-14";
  return {
    quantityKgHa: qty,
    blend: npk,
    eco: qty > 200 ? "High demand — split into 3 applications & add organic compost." : "Within sustainable range. Apply in 2 splits.",
  };
}

export function sustainabilityScore(input: YieldInput) {
  const p = PROFILES[input.crop];
  const water = Math.max(0, 1 - Math.abs(input.rainfall - p.optRain) / (p.optRain * 1.5));
  const fert = Math.max(0, 1 - Math.max(0, input.fertilizer - p.optFert) / p.optFert);
  const cropEco = ["millet", "soybean", "barley"].includes(input.crop) ? 1 : 0.75;
  const score = Math.round((water * 0.4 + fert * 0.4 + cropEco * 0.2) * 100);
  return { score, water: Math.round(water * 100), fertilizer: Math.round(fert * 100), cropEco: Math.round(cropEco * 100) };
}

export const SOILS: SoilType[] = ["loamy", "clay", "sandy", "silty", "peaty", "chalky"];
export const CROPS: CropType[] = ["wheat", "rice", "maize", "soybean", "cotton", "sugarcane", "barley", "millet"];
