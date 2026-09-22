import { describe, expect, it } from "vitest";
import { isGiftPackageCategory, isLoafOrYogurtCategory } from "./recipeCategories";

describe("recipe categories", () => {
  it("recognizes gift and flight box categories", () => {
    expect(isGiftPackageCategory("Gifts and Flight Boxes")).toBe(true);
    expect(isGiftPackageCategory("Banana bread")).toBe(false);
  });

  it("recognizes banana bread and yogurt categories", () => {
    expect(isLoafOrYogurtCategory("Banana bread")).toBe(true);
    expect(isLoafOrYogurtCategory("Yoghurt")).toBe(true);
    expect(isLoafOrYogurtCategory("Yogurt")).toBe(true);
    expect(isLoafOrYogurtCategory("Gifts and Flight Boxes")).toBe(false);
  });
});