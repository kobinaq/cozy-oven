import { costingService } from "../../services/costingService";
import { readCostItemListPage, type RecipeCostItem } from "./costItemOptions";

const PAGE_SIZE = 100;

export async function loadAllCostItems(): Promise<RecipeCostItem[]> {
  const first = readCostItemListPage(await costingService.items({ page: 1, limit: PAGE_SIZE }));
  if (first.totalPages <= 1) return first.items;

  const rest = await Promise.all(
    Array.from({ length: first.totalPages - 1 }, (_, index) =>
      costingService.items({ page: index + 2, limit: PAGE_SIZE }).then(readCostItemListPage)
    )
  );
  return [first.items, ...rest.map((page) => page.items)].flat();
}
