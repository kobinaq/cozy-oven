import { describe, expect, it } from "vitest";
import { purchaseDetail, readPurchaseList } from "./purchaseList";

const row = {
  _id: "purchase-1",
  itemName: "Flour",
  itemSKU: "FLR",
  vendorName: "Mill",
  itemCategory: "Raw Materials",
  quantityPurchased: 2,
  costPrice: 10,
  totalCost: 20,
  purchasePurpose: "Weekly bake",
  paymentMethod: "cash",
  paymentReference: "MM-1",
  costItemId: "cost-1",
};

describe("readPurchaseList", () => {
  it("keeps the matching spend, pages, and supplier names", () => {
    expect(readPurchaseList({
      data: [row, { itemName: "incomplete" }],
      totalPages: 3,
      matchingTotal: 140.5,
      vendors: [" Mill ", "Bakery", ""],
    })).toEqual({
      data: [{ ...row, vendorContact: undefined, purchasedAt: undefined, createdAt: undefined }],
      totalPages: 3,
      matchingTotal: 140.5,
      vendors: [" Mill ", "Bakery"],
    });
  });

  it("returns an empty list when the response is not a purchase page", () => {
    expect(readPurchaseList(null)).toEqual({
      data: [],
      totalPages: 1,
      matchingTotal: 0,
      vendors: [],
    });
  });
});

describe("purchaseDetail", () => {
  it("joins purpose, payment, and reference under the item name", () => {
    expect(purchaseDetail(row, { cash: "Cash" })).toBe("Weekly bake · Cash · MM-1");
  });
});