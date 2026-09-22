export type SearchPickerOption = {
  id: string;
  label: string;
  category: string;
};

export function visibleSearchOptions(
  options: SearchPickerOption[],
  query: string,
  selectedId: string,
  takenIds: string[]
): SearchPickerOption[] {
  const taken = new Set(takenIds);
  const available = options.filter((option) => option.id === selectedId || !taken.has(option.id));
  const needle = query.trim().toLowerCase();
  if (!needle) return available;
  return available.filter((option) =>
    option.label.toLowerCase().includes(needle) || option.category.toLowerCase().includes(needle)
  );
}

export function groupSearchOptions(options: SearchPickerOption[]): { category: string; options: SearchPickerOption[] }[] {
  const grouped = new Map<string, SearchPickerOption[]>();
  for (const option of options) {
    const bucket = grouped.get(option.category) ?? [];
    bucket.push(option);
    grouped.set(option.category, bucket);
  }
  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en"))
    .map(([category, groupOptions]) => ({
      category,
      options: [...groupOptions].sort((left, right) => left.label.localeCompare(right.label, "en")),
    }));
}
