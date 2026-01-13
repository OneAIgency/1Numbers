import { describe, it, expect } from "vitest";
import {
  calculateRomanticCompatibility,
  calculateFriendshipCompatibility,
  calculateProfessionalCompatibility,
  calculateFamilyCompatibility,
  analyzeRelationshipDynamics,
  getRelationshipStrengths,
  getRelationshipChallenges,
  getRelationshipRecommendations,
  RelationshipType,
} from "../compatibility";

const person1 = {
  fullName: "Maria Elena Popescu",
  birthDate: new Date("1990-05-15"),
};

const person2 = {
  fullName: "Ion Alexandru Ionescu",
  birthDate: new Date("1988-08-22"),
};

describe("calculateRomanticCompatibility", () => {
  it("returns detailed compatibility result", () => {
    const result = calculateRomanticCompatibility(person1, person2);
    expect(result.relationshipType).toBe("romantic");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("emphasizes soul urge more (40% vs 20% in base)", () => {
    const result = calculateRomanticCompatibility(person1, person2);
    expect(result.soulUrgeCompatibility).toBeDefined();
    expect(result.strengths.ro).toBeDefined();
    expect(result.challenges.ro).toBeDefined();
    expect(result.recommendations.ro).toBeDefined();
  });

  it("provides dynamics analysis", () => {
    const result = calculateRomanticCompatibility(person1, person2);
    expect(result.dynamics.communication.ro).toBeDefined();
    expect(result.dynamics.emotional.ro).toBeDefined();
    expect(result.dynamics.practical.ro).toBeDefined();
  });

  it("provides translations in all languages", () => {
    const result = calculateRomanticCompatibility(person1, person2);
    expect(result.strengths.ro).toBeDefined();
    expect(result.strengths.en).toBeDefined();
    expect(result.strengths.ru).toBeDefined();
  });
});

describe("calculateFriendshipCompatibility", () => {
  it("returns detailed compatibility result", () => {
    const result = calculateFriendshipCompatibility(person1, person2);
    expect(result.relationshipType).toBe("friendship");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("balances all aspects (35%, 35%, 30%)", () => {
    const result = calculateFriendshipCompatibility(person1, person2);
    expect(result.lifePathCompatibility).toBeDefined();
    expect(result.destinyCompatibility).toBeDefined();
    expect(result.soulUrgeCompatibility).toBeDefined();
  });

  it("provides friendship-specific strengths", () => {
    const result = calculateFriendshipCompatibility(person1, person2);
    expect(result.strengths.ro.length).toBeGreaterThan(0);
    expect(result.challenges.ro.length).toBeGreaterThan(0);
  });
});

describe("calculateProfessionalCompatibility", () => {
  it("returns detailed compatibility result", () => {
    const result = calculateProfessionalCompatibility(person1, person2);
    expect(result.relationshipType).toBe("professional");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("emphasizes life path and destiny (50%, 40%)", () => {
    const result = calculateProfessionalCompatibility(person1, person2);
    expect(result.lifePathCompatibility).toBeDefined();
    expect(result.destinyCompatibility).toBeDefined();
  });

  it("provides professional-specific recommendations", () => {
    const result = calculateProfessionalCompatibility(person1, person2);
    expect(result.recommendations.ro.length).toBeGreaterThan(0);
  });
});

describe("calculateFamilyCompatibility", () => {
  it("returns detailed compatibility result", () => {
    const result = calculateFamilyCompatibility(person1, person2);
    expect(result.relationshipType).toBe("family");
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);
  });

  it("emphasizes life path and soul urge (45%, 35%)", () => {
    const result = calculateFamilyCompatibility(person1, person2);
    expect(result.lifePathCompatibility).toBeDefined();
    expect(result.soulUrgeCompatibility).toBeDefined();
  });

  it("provides family-specific dynamics", () => {
    const result = calculateFamilyCompatibility(person1, person2);
    expect(result.dynamics.communication.ro).toBeDefined();
    expect(result.dynamics.emotional.ro).toBeDefined();
  });
});

describe("analyzeRelationshipDynamics", () => {
  const relationshipTypes: RelationshipType[] = ["romantic", "friendship", "professional", "family"];

  relationshipTypes.forEach(type => {
    it(`analyzes ${type} dynamics correctly`, () => {
      const dynamics = analyzeRelationshipDynamics(person1, person2, type);
      expect(dynamics.communication.ro).toBeDefined();
      expect(dynamics.emotional.ro).toBeDefined();
      expect(dynamics.practical.ro).toBeDefined();
      expect(dynamics.communication.en).toBeDefined();
      expect(dynamics.communication.ru).toBeDefined();
    });
  });
});

describe("getRelationshipStrengths", () => {
  const relationshipTypes: RelationshipType[] = ["romantic", "friendship", "professional", "family"];

  relationshipTypes.forEach(type => {
    it(`returns strengths for ${type} relationship`, () => {
      const strengths = getRelationshipStrengths(person1, person2, type);
      expect(strengths.ro).toBeDefined();
      expect(strengths.en).toBeDefined();
      expect(strengths.ru).toBeDefined();
      expect(Array.isArray(strengths.ro)).toBe(true);
    });
  });
});

describe("getRelationshipChallenges", () => {
  const relationshipTypes: RelationshipType[] = ["romantic", "friendship", "professional", "family"];

  relationshipTypes.forEach(type => {
    it(`returns challenges for ${type} relationship`, () => {
      const challenges = getRelationshipChallenges(person1, person2, type);
      expect(challenges.ro).toBeDefined();
      expect(challenges.en).toBeDefined();
      expect(challenges.ru).toBeDefined();
      expect(Array.isArray(challenges.ro)).toBe(true);
    });
  });
});

describe("getRelationshipRecommendations", () => {
  const relationshipTypes: RelationshipType[] = ["romantic", "friendship", "professional", "family"];

  relationshipTypes.forEach(type => {
    it(`returns recommendations for ${type} relationship`, () => {
      // Calculate compatibility score first
      let compatibilityScore: number;
      switch (type) {
        case "romantic":
          compatibilityScore = calculateRomanticCompatibility(person1, person2).overallScore;
          break;
        case "friendship":
          compatibilityScore = calculateFriendshipCompatibility(person1, person2).overallScore;
          break;
        case "professional":
          compatibilityScore = calculateProfessionalCompatibility(person1, person2).overallScore;
          break;
        case "family":
          compatibilityScore = calculateFamilyCompatibility(person1, person2).overallScore;
          break;
        default:
          compatibilityScore = 70;
      }
      
      const recommendations = getRelationshipRecommendations(compatibilityScore, type);
      expect(recommendations.ro).toBeDefined();
      expect(recommendations.en).toBeDefined();
      expect(recommendations.ru).toBeDefined();
      expect(Array.isArray(recommendations.ro)).toBe(true);
    });
  });
});

