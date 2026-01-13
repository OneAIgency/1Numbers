import { describe, it, expect } from "vitest";
import {
  analyzeIndividualLetters,
  analyzeVowelsSeparately,
  analyzeConsonantsSeparately,
  findHiddenNumbers,
  getNameOptimizationSuggestions,
  analyzeNameNumbers,
} from "../nameAnalysis";

describe("analyzeIndividualLetters", () => {
  it("analyzes each letter correctly", () => {
    const result = analyzeIndividualLetters("Maria");
    expect(result).toHaveLength(5);
    expect(result[0].letter).toBe("M");
    expect(result[0].value).toBe(4);
    expect(result[0].isConsonant).toBe(true);
    expect(result[0].isVowel).toBe(false);
  });

  it("identifies vowels correctly", () => {
    const result = analyzeIndividualLetters("Maria");
    const vowels = result.filter(l => l.isVowel);
    expect(vowels).toHaveLength(3); // A, I, A
    expect(vowels[0].letter).toBe("A");
  });

  it("identifies consonants correctly", () => {
    const result = analyzeIndividualLetters("Maria");
    const consonants = result.filter(l => l.isConsonant);
    expect(consonants).toHaveLength(2); // M, R
  });

  it("handles empty string", () => {
    const result = analyzeIndividualLetters("");
    expect(result).toHaveLength(0);
  });

  it("ignores non-alphabetic characters", () => {
    const result = analyzeIndividualLetters("Maria123!");
    expect(result).toHaveLength(5); // Only letters
  });

  it("assigns correct positions", () => {
    const result = analyzeIndividualLetters("ABC");
    expect(result[0].position).toBe(1);
    expect(result[1].position).toBe(2);
    expect(result[2].position).toBe(3);
  });
});

describe("analyzeVowelsSeparately", () => {
  it("calculates soul urge number correctly", () => {
    const result = analyzeVowelsSeparately("Maria");
    // M-A-R-I-A: vowels A(1) + I(9) + A(1) = 11
    expect(result.soulUrgeNumber).toBe(11);
  });

  it("returns all vowels", () => {
    const result = analyzeVowelsSeparately("Maria Elena");
    expect(result.vowels.length).toBeGreaterThan(0);
    expect(result.vowels.every(v => v.isVowel)).toBe(true);
  });

  it("calculates total value", () => {
    const result = analyzeVowelsSeparately("Maria");
    expect(result.totalValue).toBeGreaterThan(0);
  });

  it("provides interpretation in all languages", () => {
    const result = analyzeVowelsSeparately("Maria");
    expect(result.interpretation.ro).toBeDefined();
    expect(result.interpretation.en).toBeDefined();
    expect(result.interpretation.ru).toBeDefined();
  });

  it("provides strengths in all languages", () => {
    const result = analyzeVowelsSeparately("Maria");
    expect(result.strengths.ro).toBeDefined();
    expect(result.strengths.en).toBeDefined();
    expect(result.strengths.ru).toBeDefined();
  });
});

describe("analyzeConsonantsSeparately", () => {
  it("calculates personality number correctly", () => {
    const result = analyzeConsonantsSeparately("Maria");
    // M-A-R-I-A: consonants M(4) + R(9) = 13 → 4
    expect(result.personalityNumber).toBe(4);
  });

  it("returns all consonants", () => {
    const result = analyzeConsonantsSeparately("Maria Elena");
    expect(result.consonants.length).toBeGreaterThan(0);
    expect(result.consonants.every(c => c.isConsonant)).toBe(true);
  });

  it("calculates total value", () => {
    const result = analyzeConsonantsSeparately("Maria");
    expect(result.totalValue).toBeGreaterThan(0);
  });

  it("provides interpretation in all languages", () => {
    const result = analyzeConsonantsSeparately("Maria");
    expect(result.interpretation.ro).toBeDefined();
    expect(result.interpretation.en).toBeDefined();
    expect(result.interpretation.ru).toBeDefined();
  });

  it("provides characteristics in all languages", () => {
    const result = analyzeConsonantsSeparately("Maria");
    expect(result.characteristics.ro).toBeDefined();
    expect(result.characteristics.en).toBeDefined();
    expect(result.characteristics.ru).toBeDefined();
  });
});

describe("findHiddenNumbers", () => {
  it("finds numbers that appear but aren't main numbers", () => {
    const result = findHiddenNumbers("Maria Elena Popescu");
    expect(Array.isArray(result)).toBe(true);
    result.forEach(hidden => {
      expect(hidden.number).toBeGreaterThan(0);
      expect(hidden.number).toBeLessThanOrEqual(9);
      expect(hidden.frequency).toBeGreaterThan(0);
      expect(hidden.influence).toMatch(/strong|moderate|weak/);
    });
  });

  it("excludes main numbers (destiny, soul urge, personality)", () => {
    const result = findHiddenNumbers("Maria");
    const mainNumbers = [
      analyzeNameNumbers("Maria").destinyNumber,
      analyzeNameNumbers("Maria").soulUrgeNumber,
      analyzeNameNumbers("Maria").personalityNumber,
    ];
    
    result.forEach(hidden => {
      expect(mainNumbers).not.toContain(hidden.number);
    });
  });

  it("sorts by frequency (highest first)", () => {
    const result = findHiddenNumbers("AABBCC");
    if (result.length > 1) {
      expect(result[0].frequency).toBeGreaterThanOrEqual(result[1].frequency);
    }
  });

  it("provides significance in all languages", () => {
    const result = findHiddenNumbers("Maria");
    if (result.length > 0) {
      expect(result[0].significance.ro).toBeDefined();
      expect(result[0].significance.en).toBeDefined();
      expect(result[0].significance.ru).toBeDefined();
    }
  });
});

describe("getNameOptimizationSuggestions", () => {
  it("returns suggestions based on target numbers", () => {
    const result = getNameOptimizationSuggestions("Maria", [1, 8], "ro");
    expect(result.currentAnalysis).toBeDefined();
    expect(result.targetNumbers).toEqual([1, 8]);
    expect(Array.isArray(result.suggestions)).toBe(true);
  });

  it("includes current analysis", () => {
    const result = getNameOptimizationSuggestions("Maria", [1, 8], "ro");
    expect(result.currentAnalysis.destinyNumber).toBeDefined();
    expect(result.currentAnalysis.soulUrgeNumber).toBeDefined();
    expect(result.currentAnalysis.personalityNumber).toBeDefined();
  });

  it("provides recommendations in all languages", () => {
    const result = getNameOptimizationSuggestions("Maria", [1, 8], "ro");
    expect(result.recommendations.ro).toBeDefined();
    expect(result.recommendations.en).toBeDefined();
    expect(result.recommendations.ru).toBeDefined();
  });

  it("sorts suggestions by overall score", () => {
    const result = getNameOptimizationSuggestions("Maria", [1, 8], "ro");
    if (result.suggestions.length > 1) {
      expect(result.suggestions[0].overallScore).toBeGreaterThanOrEqual(
        result.suggestions[1].overallScore
      );
    }
  });

  it("includes improvement details for each suggestion", () => {
    const result = getNameOptimizationSuggestions("Maria", [1, 8], "ro");
    if (result.suggestions.length > 0) {
      const suggestion = result.suggestions[0];
      expect(suggestion.improvements.destiny).toBeDefined();
      expect(suggestion.improvements.soulUrge).toBeDefined();
      expect(suggestion.improvements.personality).toBeDefined();
      expect(suggestion.reason.ro).toBeDefined();
    }
  });
});

