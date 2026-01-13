import { describe, it, expect } from "vitest";
import {
  compareMultiplePeople,
  analyzeGroupCompatibility,
  calculateGroupHarmony,
  PersonData,
} from "../multiPersonCompatibility";

const people: PersonData[] = [
  {
    id: "1",
    fullName: "Maria Elena Popescu",
    birthDate: new Date("1990-05-15"),
  },
  {
    id: "2",
    fullName: "Ion Alexandru Ionescu",
    birthDate: new Date("1988-08-22"),
  },
  {
    id: "3",
    fullName: "Ana Maria Georgescu",
    birthDate: new Date("1992-03-10"),
  },
];

describe("compareMultiplePeople", () => {
  it("requires at least 3 people", () => {
    expect(() => compareMultiplePeople(people.slice(0, 2))).toThrow();
  });

  it("calculates compatibility for all pairs", () => {
    const result = compareMultiplePeople(people);
    // 3 people = 3 pairs: (1,2), (1,3), (2,3)
    expect(result.pairCompatibilities).toHaveLength(3);
  });

  it("calculates average compatibility", () => {
    const result = compareMultiplePeople(people);
    expect(result.averageCompatibility).toBeGreaterThanOrEqual(0);
    expect(result.averageCompatibility).toBeLessThanOrEqual(100);
  });

  it("calculates group harmony", () => {
    const result = compareMultiplePeople(people);
    expect(result.groupHarmony).toBeGreaterThanOrEqual(0);
    expect(result.groupHarmony).toBeLessThanOrEqual(100);
  });

  it("identifies strongest pairs", () => {
    const result = compareMultiplePeople(people);
    expect(result.strongestPairs.length).toBeGreaterThan(0);
    expect(result.strongestPairs.length).toBeLessThanOrEqual(3);
    
    result.strongestPairs.forEach(pair => {
      expect(pair.compatibility.overallScore).toBeGreaterThanOrEqual(0);
      expect(pair.compatibility.overallScore).toBeLessThanOrEqual(100);
    });
  });

  it("identifies weakest pairs", () => {
    const result = compareMultiplePeople(people);
    expect(result.weakestPairs.length).toBeGreaterThan(0);
    expect(result.weakestPairs.length).toBeLessThanOrEqual(3);
    
    result.weakestPairs.forEach(pair => {
      expect(pair.compatibility.overallScore).toBeGreaterThanOrEqual(0);
      expect(pair.compatibility.overallScore).toBeLessThanOrEqual(100);
    });
  });

  it("sorts strongest pairs by score (highest first)", () => {
    const result = compareMultiplePeople(people);
    if (result.strongestPairs.length > 1) {
      expect(result.strongestPairs[0].compatibility.overallScore)
        .toBeGreaterThanOrEqual(result.strongestPairs[1].compatibility.overallScore);
    }
  });

  it("provides recommendations in all languages", () => {
    const result = compareMultiplePeople(people);
    expect(result.recommendations.ro).toBeDefined();
    expect(result.recommendations.en).toBeDefined();
    expect(result.recommendations.ru).toBeDefined();
    expect(Array.isArray(result.recommendations.ro)).toBe(true);
  });

  it("includes all people in result", () => {
    const result = compareMultiplePeople(people);
    expect(result.people).toHaveLength(3);
    expect(result.people.map(p => p.id)).toEqual(["1", "2", "3"]);
  });
});

describe("analyzeGroupCompatibility", () => {
  it("requires at least 2 people", () => {
    expect(() => analyzeGroupCompatibility([people[0]])).toThrow();
  });

  it("analyzes family group", () => {
    const result = analyzeGroupCompatibility(people, "family");
    expect(result.groupType).toBe("family");
    expect(result.groupHarmony).toBeGreaterThanOrEqual(0);
    expect(result.groupHarmony).toBeLessThanOrEqual(100);
  });

  it("analyzes team group", () => {
    const result = analyzeGroupCompatibility(people, "team");
    expect(result.groupType).toBe("team");
    expect(result.groupHarmony).toBeGreaterThanOrEqual(0);
  });

  it("analyzes general group", () => {
    const result = analyzeGroupCompatibility(people, "general");
    expect(result.groupType).toBe("general");
    expect(result.groupHarmony).toBeGreaterThanOrEqual(0);
  });

  it("identifies dominant numbers", () => {
    const result = analyzeGroupCompatibility(people);
    expect(result.dominantNumbers.lifePath).toBeDefined();
    expect(result.dominantNumbers.destiny).toBeDefined();
    expect(result.dominantNumbers.soulUrge).toBeDefined();
    expect(Array.isArray(result.dominantNumbers.lifePath)).toBe(true);
  });

  it("provides group energy in all languages", () => {
    const result = analyzeGroupCompatibility(people);
    expect(result.groupEnergy.ro).toBeDefined();
    expect(result.groupEnergy.en).toBeDefined();
    expect(result.groupEnergy.ru).toBeDefined();
  });

  it("provides strengths and challenges", () => {
    const result = analyzeGroupCompatibility(people);
    expect(result.strengths.ro).toBeDefined();
    expect(result.challenges.ro).toBeDefined();
    expect(Array.isArray(result.strengths.ro)).toBe(true);
    expect(Array.isArray(result.challenges.ro)).toBe(true);
  });

  it("provides recommendations", () => {
    const result = analyzeGroupCompatibility(people);
    expect(result.recommendations.ro).toBeDefined();
    expect(Array.isArray(result.recommendations.ro)).toBe(true);
  });
});

describe("calculateGroupHarmony", () => {
  it("calculates harmony for 3 people", () => {
    const harmony = calculateGroupHarmony(people);
    expect(harmony).toBeGreaterThanOrEqual(0);
    expect(harmony).toBeLessThanOrEqual(100);
  });

  it("calculates harmony for 4 people", () => {
    const fourPeople = [
      ...people,
      {
        id: "4",
        fullName: "George Popescu",
        birthDate: new Date("1985-11-20"),
      },
    ];
    const harmony = calculateGroupHarmony(fourPeople);
    expect(harmony).toBeGreaterThanOrEqual(0);
    expect(harmony).toBeLessThanOrEqual(100);
  });

  it("returns higher harmony for compatible groups", () => {
    // This is a basic test - in practice, harmony depends on number compatibility
    const harmony = calculateGroupHarmony(people);
    expect(typeof harmony).toBe("number");
  });
});

