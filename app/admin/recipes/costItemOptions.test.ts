import { describe, expect, it } from "vitest";
import {
  groupCostItems,
  matchingCostItems,
  readCostItemListPage,
  selectableCostItems,
  toRecipeCostItem,
  type RecipeCostItem,
} from "./costItemOptions";

const flour: RecipeCostItem = {
  _id: "flour",
  name: "Bread flour",
  unit: "kg",
  costPerUnit: 12,
  categoryName: "Ingredients",
};
const butter: RecipeCostItem = {
  _id: "butter",
  name: "Butter",
  unit: "g",
  costPerUnit: 0.08,
  categoryName: "Ingredients",
};
const box: RecipeCostItem = {
  _id: "box",
  name: "Cake box",
  unit: "piece",
  costPerUnit: 3,
  categoryName: "Packaging",
};

describe("toRecipeCostItem", () => {
  it("keeps a populated category name", () => {
    expect(toRecipeCostItem({
      _id: "flour",
      name: "Bread flour",
      unit: "kg",
      costPerUnit: 12,
      categoryId: { _id: "cat", name: "Ingredients" },
    })).toEqual(flour);
  });

  it("uses Other when the category is only an id", () => {
    expect(toRecipeCostItem({
      _id: "flour",
      name: "Bread flour",
      unit: "kg",
      costPerUnit: 12,
      categoryId: "cat",
    })?.categoryName).toBe("Other");
  });

  it("drops rows that are not cost items", () => {
    expect(toRecipeCostItem({ _id: "flour", name: "Bread flour" })).toBeNull();
  });
});

describe("matchingCostItems", () => {
  const items = [flour, butter, box];

  it("returns every item for a blank query", () => {
    expect(matchingCostItems(items, "  ")).toEqual(items);
  });

  it("matches name, category, and unit", () => {
    expect(matchingCostItems(items, "flour").map((item) => item._id)).toEqual(["flour"]);
    expect(matchingCostItems(items, "pack").map((item) => item._id)).toEqual(["box"]);
    expect(matchingCostItems(items, "piece").map((item) => item._id)).toEqual(["box"]);
  });
});

describe("selectableCostItems", () => {
  it("hides items already chosen on other rows and keeps the current selection", () => {
    expect(selectableCostItems([flour, butter, box], "butter", ["butter", "box"]).map((item) => item._id)).toEqual(["flour", "butter"]);
  });
});

describe("groupCostItems", () => {
  it("groups by category and sorts categories and names", () => {
    expect(groupCostItems([box, butter, flour])).toEqual([
      { category: "Ingredients", items: [flour, butter] },
      { category: "Packaging", items: [box] },
    ]);
  });
});

describe("readCostItemListPage", () => {
  it("reads items and a valid page count", () => {
    expect(readCostItemListPage({
      data: [
        {
          _id: "flour",
          name: "Bread flour",
          unit: "kg",
          costPerUnit: 12,
          categoryId: { _id: "cat", name: "Ingredients" },
        },
        { name: "broken" },
      ],
      pagination: { totalPages: 3 },
    })).toEqual({ items: [flour], totalPages: 3 });
  });

  it("falls back when the payload is not a list page", () => {
    expect(readCostItemListPage(null)).toEqual({ items: [], totalPages: 1 });
  });
});
