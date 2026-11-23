/**
 * Simulated AI Evaluation Service
 *
 * Produces deterministic scores from the content by hashing the input strings.
 * Same input → same output every time.
 */

interface EvaluationInput {
  name: string;
  tagline: string;
  description: string;
  category: string;
}

interface EvaluationResult {
  overallScore: number;
  marketPotentialScore: number;
  innovationScore: number;
  feasibilityScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

// Simple deterministic hash → number in [0, 1)
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // 32-bit int
  }
  return Math.abs(hash % 10000) / 10000;
}

function boundedScore(hash: number, min = 45, max = 95): number {
  return Math.round(min + hash * (max - min));
}

const strengthPool = [
  "Addresses a clear and validated market need",
  "Strong potential for recurring revenue model",
  "Leverages existing technology infrastructure",
  "Compelling unique value proposition",
  "Scalable across multiple demographics",
  "Low customer acquisition cost potential",
  "Strong network effects built into the model",
  "High user retention probability",
  "Clear path to monetization",
  "Aligns with current market trends",
  "First-mover advantage in the niche",
  "Solves a pain point with measurable impact",
];

const improvementPool = [
  "Consider a more detailed competitive analysis",
  "Develop a clearer go-to-market strategy",
  "Explore partnerships for faster market entry",
  "Add more specifics on user acquisition channels",
  "Strengthen the technical architecture plan",
  "Define key metrics and success criteria early",
  "Build a stronger brand differentiation strategy",
  "Consider regulatory and compliance requirements",
  "Develop a contingency plan for key risks",
  "Outline a phased MVP approach",
  "Identify and mitigate single points of failure",
  "Plan for international expansion early",
];

function pickItems(pool: string[], seed: number, count: number): string[] {
  const items: string[] = [];
  const used = new Set<number>();
  let s = Math.abs(Math.round(seed * 100000));
  while (items.length < count && items.length < pool.length) {
    const idx = s % pool.length;
    if (!used.has(idx)) {
      used.add(idx);
      items.push(pool[idx]);
    }
    s = (s * 31 + 7) % 100003;
  }
  return items;
}

export function evaluateIdea(input: EvaluationInput): EvaluationResult {
  const combined = `${input.name}|${input.tagline}|${input.description}|${input.category}`;

  const h1 = simpleHash(combined);
  const h2 = simpleHash(combined + ":market");
  const h3 = simpleHash(combined + ":innovation");
  const h4 = simpleHash(combined + ":feasibility");

  const marketPotentialScore = boundedScore(h2, 40, 95);
  const innovationScore = boundedScore(h3, 35, 98);
  const feasibilityScore = boundedScore(h4, 50, 92);
  const overallScore = Math.round(
    marketPotentialScore * 0.35 +
      innovationScore * 0.35 +
      feasibilityScore * 0.3
  );

  const strengths = pickItems(strengthPool, h1, 3);
  const improvements = pickItems(improvementPool, h1 + 0.5, 3);

  const ratingWord =
    overallScore >= 80
      ? "highly promising"
      : overallScore >= 60
        ? "promising"
        : "has potential";

  const summary = `"${input.name}" is a ${ratingWord} concept in the ${input.category} space. With a market potential score of ${marketPotentialScore} and an innovation score of ${innovationScore}, it demonstrates solid foundations for growth. Focus on the recommended improvements to maximize your chances of success.`;

  return {
    overallScore,
    marketPotentialScore,
    innovationScore,
    feasibilityScore,
    strengths,
    improvements,
    summary,
  };
}
