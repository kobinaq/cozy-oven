import { describe, expect, it } from "vitest";
import {
  readCostItemListPage,
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
