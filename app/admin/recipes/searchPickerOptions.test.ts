import { describe, expect, it } from "vitest";
import { groupSearchOptions, visibleSearchOptions, type SearchPickerOption } from "./searchPickerOptions";

const flour: SearchPickerOption = { id: "flour", label: "Bread flour (kg)", category: "Ingredients" };
const butter: SearchPickerOption = { id: "butter", label: "Butter (g)", category: "Ingredients" };
const box: SearchPickerOption = { id: "box", label: "Cake box (piece)", category: "Packaging" };
const loaf: SearchPickerOption = { id: "loaf", label: "Milk loaf", category: "Bread" };
const cake: SearchPickerOption = { id: "cake", label: "Vanilla cake", category: "Cakes" };

describe("visibleSearchOptions", () => {
  it("returns every available option for a blank query", () => {
    expect(visibleSearchOptions([flour, butter], "  ", "", [])).toEqual([flour, butter]);
  });

  it("matches the label and the category", () => {
    expect(visibleSearchOptions([flour, butter, box], "piece", "", []).map((option) => option.id)).toEqual(["box"]);
    expect(visibleSearchOptions([flour, butter, box], "pack", "", []).map((option) => option.id)).toEqual(["box"]);
    expect(visibleSearchOptions([loaf, cake], "vanilla", "", []).map((option) => option.id)).toEqual(["cake"]);
  });

  it("hides options already chosen elsewhere and keeps the current selection", () => {
    expect(visibleSearchOptions([flour, butter, box], "", "butter", ["butter", "box"]).map((option) => option.id)).toEqual(["flour", "butter"]);
  });
});

describe("groupSearchOptions", () => {
  it("groups by category and sorts categories and labels", () => {
    expect(groupSearchOptions([box, butter, flour, cake, loaf])).toEqual([
      { category: "Bread", options: [loaf] },
      { category: "Cakes", options: [cake] },
      { category: "Ingredients", options: [flour, butter] },
      { category: "Packaging", options: [box] },
    ]);
  });
});
