export const isGiftPackageCategory = (category: unknown): boolean => {
  const normalized = String(category || "").trim().toLowerCase();
  return normalized === "package" || normalized === "gifts and flight boxes";
};

export const isLoafOrYogurtCategory = (category: unknown): boolean => {
  const normalized = String(category || "").trim().toLowerCase();
  return normalized === "banana bread" || normalized === "yoghurt" || normalized === "yogurt";
};
