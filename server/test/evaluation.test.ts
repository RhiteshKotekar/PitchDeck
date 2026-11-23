import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateIdea } from "../src/services/evaluation.js";

describe("Simulated AI Evaluation Service", () => {
  it("generates scores bounded strictly between 0 and 100", () => {
    const samples = [
      { name: "StudySync", tagline: "Collab learning", description: "A platform for students", category: "Education" },
      { name: "GreenCart", tagline: "Eco shopping", description: "Sustainable goods marketplace", category: "Sustainability" },
      { name: "MediTrack", tagline: "Health records", description: "Personal records organizer", category: "Health" },
      { name: "SkillBridge", tagline: "Micro internships", description: "Students with projects", category: "Productivity" },
      { name: "A", tagline: "B", description: "C", category: "Technology" },
      { name: "X".repeat(50), tagline: "Y".repeat(100), description: "Z".repeat(500), category: "Finance" },
    ];

    for (const sample of samples) {
      const result = evaluateIdea(sample);

      assert.ok(result.overallScore >= 0 && result.overallScore <= 100, `overallScore ${result.overallScore} must be 0-100`);
      assert.ok(result.marketPotentialScore >= 0 && result.marketPotentialScore <= 100, `marketPotentialScore ${result.marketPotentialScore} must be 0-100`);
      assert.ok(result.innovationScore >= 0 && result.innovationScore <= 100, `innovationScore ${result.innovationScore} must be 0-100`);
      assert.ok(result.feasibilityScore >= 0 && result.feasibilityScore <= 100, `feasibilityScore ${result.feasibilityScore} must be 0-100`);
    }
  });

  it("contains all expected fields in evaluation result", () => {
    const result = evaluateIdea({
      name: "StudySync",
      tagline: "Collab learning",
      description: "Collaborative learning platform",
      category: "Education",
    });

    assert.ok(typeof result.overallScore === "number");
    assert.ok(typeof result.marketPotentialScore === "number");
    assert.ok(typeof result.innovationScore === "number");
    assert.ok(typeof result.feasibilityScore === "number");
    assert.ok(Array.isArray(result.strengths) && result.strengths.length > 0);
    assert.ok(Array.isArray(result.improvements) && result.improvements.length > 0);
    assert.ok(typeof result.summary === "string" && result.summary.length > 0);
  });

  it("produces deterministic results for identical input", () => {
    const input = {
      name: "GreenCart",
      tagline: "Eco shopping",
      description: "Sustainable shopping platform",
      category: "Sustainability",
    };

    const first = evaluateIdea(input);
    const second = evaluateIdea(input);

    assert.equal(first.overallScore, second.overallScore);
    assert.equal(first.marketPotentialScore, second.marketPotentialScore);
    assert.equal(first.innovationScore, second.innovationScore);
    assert.equal(first.feasibilityScore, second.feasibilityScore);
    assert.deepEqual(first.strengths, second.strengths);
    assert.deepEqual(first.improvements, second.improvements);
    assert.equal(first.summary, second.summary);
  });

  it("produces different scores for distinct ideas", () => {
    const ideaA = evaluateIdea({
      name: "Quantum AI Compute",
      tagline: "Next gen supercomputing",
      description: "High performance quantum algorithms",
      category: "Technology",
    });

    const ideaB = evaluateIdea({
      name: "Local Dog Bakery",
      tagline: "Organic dog treats",
      description: "Handcrafted treats delivered locally",
      category: "Commerce",
    });

    assert.notEqual(
      `${ideaA.overallScore}-${ideaA.marketPotentialScore}-${ideaA.innovationScore}`,
      `${ideaB.overallScore}-${ideaB.marketPotentialScore}-${ideaB.innovationScore}`
    );
  });
});

