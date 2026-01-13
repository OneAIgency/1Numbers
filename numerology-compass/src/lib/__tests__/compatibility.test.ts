import { describe, it, expect } from "vitest";
import {
  getCompatibilityScore,
  calculateCompatibility,
  getCompatibilityLevel,
} from "../compatibility";

describe("getCompatibilityScore", () => {
  describe("basic functionality", () => {
    it("returns a score between 40 and 100", () => {
      for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
          const score = getCompatibilityScore(i, j);
          expect(score).toBeGreaterThanOrEqual(40);
          expect(score).toBeLessThanOrEqual(100);
        }
      }
    });

    it("handles same numbers", () => {
      const score = getCompatibilityScore(5, 5);
      expect(score).toBeGreaterThanOrEqual(40);
    });
  });

  describe("known compatibility pairs", () => {
    it("returns high score for 1 and 3 (known good match)", () => {
      const score = getCompatibilityScore(1, 3);
      expect(score).toBe(90);
    });

    it("returns high score for 2 and 6 (known excellent match)", () => {
      const score = getCompatibilityScore(2, 6);
      expect(score).toBe(95);
    });

    it("returns lower score for 4 and 5 (known challenging)", () => {
      const score = getCompatibilityScore(4, 5);
      expect(score).toBe(40);
    });
  });

  describe("master numbers", () => {
    it("handles master number 11", () => {
      const score = getCompatibilityScore(11, 2);
      expect(score).toBe(95);
    });

    it("handles master number 22", () => {
      const score = getCompatibilityScore(22, 4);
      expect(score).toBe(95);
    });

    it("handles master number 33", () => {
      const score = getCompatibilityScore(33, 6);
      expect(score).toBe(98);
    });

    it("handles two master numbers together", () => {
      const score = getCompatibilityScore(11, 22);
      expect(score).toBe(95);
    });
  });

  describe("symmetry", () => {
    it("returns same score regardless of order", () => {
      expect(getCompatibilityScore(1, 5)).toBe(getCompatibilityScore(5, 1));
      expect(getCompatibilityScore(3, 7)).toBe(getCompatibilityScore(7, 3));
      expect(getCompatibilityScore(2, 9)).toBe(getCompatibilityScore(9, 2));
    });
  });
});

describe("calculateCompatibility", () => {
  const person1 = {
    fullName: "Maria Elena Popescu",
    birthDate: new Date("1990-05-15"),
  };

  const person2 = {
    fullName: "Ion Alexandru Ionescu",
    birthDate: new Date("1988-08-22"),
  };

  it("returns overall score between 0 and 100", () => {
    const result = calculateCompatibility(person1, person2);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("returns life path compatibility", () => {
    const result = calculateCompatibility(person1, person2);
    expect(result.lifePathCompatibility).toBeDefined();
    expect(result.lifePathCompatibility.score).toBeGreaterThanOrEqual(40);
    expect(result.lifePathCompatibility.score).toBeLessThanOrEqual(100);
    expect(result.lifePathCompatibility.person1).toBeDefined();
    expect(result.lifePathCompatibility.person2).toBeDefined();
  });

  it("returns destiny compatibility", () => {
    const result = calculateCompatibility(person1, person2);
    expect(result.destinyCompatibility).toBeDefined();
    expect(result.destinyCompatibility.score).toBeGreaterThanOrEqual(40);
    expect(result.destinyCompatibility.score).toBeLessThanOrEqual(100);
  });

  it("returns soul urge compatibility", () => {
    const result = calculateCompatibility(person1, person2);
    expect(result.soulUrgeCompatibility).toBeDefined();
    expect(result.soulUrgeCompatibility.score).toBeGreaterThanOrEqual(40);
    expect(result.soulUrgeCompatibility.score).toBeLessThanOrEqual(100);
  });

  it("calculates weighted overall score correctly", () => {
    const result = calculateCompatibility(person1, person2);

    // Weighted: Life Path 50%, Destiny 30%, Soul Urge 20%
    const expectedOverall = Math.round(
      result.lifePathCompatibility.score * 0.5 +
      result.destinyCompatibility.score * 0.3 +
      result.soulUrgeCompatibility.score * 0.2
    );

    expect(result.overallScore).toBe(expectedOverall);
  });

  it("handles same person", () => {
    const result = calculateCompatibility(person1, person1);
    expect(result.overallScore).toBeGreaterThanOrEqual(70); // Same person = high compatibility
  });
});

describe("getCompatibilityLevel", () => {
  it("returns 'excellent' for scores >= 85", () => {
    expect(getCompatibilityLevel(85)).toBe("excellent");
    expect(getCompatibilityLevel(90)).toBe("excellent");
    expect(getCompatibilityLevel(100)).toBe("excellent");
  });

  it("returns 'good' for scores 70-84", () => {
    expect(getCompatibilityLevel(70)).toBe("good");
    expect(getCompatibilityLevel(75)).toBe("good");
    expect(getCompatibilityLevel(84)).toBe("good");
  });

  it("returns 'moderate' for scores 55-69", () => {
    expect(getCompatibilityLevel(55)).toBe("moderate");
    expect(getCompatibilityLevel(60)).toBe("moderate");
    expect(getCompatibilityLevel(69)).toBe("moderate");
  });

  it("returns 'challenging' for scores < 55", () => {
    expect(getCompatibilityLevel(54)).toBe("challenging");
    expect(getCompatibilityLevel(40)).toBe("challenging");
    expect(getCompatibilityLevel(0)).toBe("challenging");
  });
});
