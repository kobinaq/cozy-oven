import { describe, expect, it } from "vitest";
import { isSaleActive, resolveProductPrice } from "./productPricing";

describe("productPricing", () => {
  const now = new Date("2026-07-24T12:00:00.000Z");

  it("requires a sale price that was actually entered", () => {
    expect(isSaleActive({}, now)).toBe(false);
    expect(isSaleActive({ salePrice: null }, now)).toBe(false);
    expect(isSaleActive({ salePrice: -1 }, now)).toBe(false);
    expect(isSaleActive({ salePrice: 0 }, now)).toBe(true);
    expect(isSaleActive({ salePrice: 10 }, now)).toBe(true);
  });

  it("keeps the base price when no sale price was entered", () => {
    expect(resolveProductPrice(100, { salePrice: null }, now)).toEqual({
      price: 100,
      compareAtPrice: null,
      onSale: false,
    });
  });

  it("resolves effective and compare-at prices", () => {
    expect(resolveProductPrice(40, { salePrice: 30 }, now)).toEqual({
      price: 30,
      compareAtPrice: 40,
      onSale: true,
    });
  });
});
