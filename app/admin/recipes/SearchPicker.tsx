"use client";

import { Search01Icon } from "@hugeicons/core-free-icons";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import AdminIcon from "../components/AdminIcon";
import { groupSearchOptions, visibleSearchOptions, type SearchPickerOption } from "./searchPickerOptions";

type SearchPickerProps = {
  options: SearchPickerOption[];
  value: string;
  takenIds?: string[];
  placeholder: string;
  emptyLabel: string;
  noMatchLabel: string;
  onChange: (id: string) => void;
};

export default function SearchPicker({
  options,
  value,
  takenIds = [],
  placeholder,
  emptyLabel,
  noMatchLabel,
  onChange,
}: SearchPickerProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const selected = options.find((option) => option.id === value) ?? null;
  const groups = useMemo(
    () => groupSearchOptions(visibleSearchOptions(options, query, value, takenIds)),
    [options, query, takenIds, value]
  );
  const flat = useMemo(() => groups.flatMap((group) => group.options), [groups]);

  useEffect(() => {
    if (open && !wasOpen.current) {
      const visible = groupSearchOptions(visibleSearchOptions(options, "", value, takenIds)).flatMap((group) => group.options);
      const index = visible.findIndex((option) => option.id === value);
      setActiveIndex(index >= 0 ? index : 0);
    }
    wasOpen.current = open;
  }, [open, options, takenIds, value]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const option = document.getElementById(`${listId}-option-${activeIndex}`);
    const list = listRef.current;
    if (!option || !list.contains(option)) return;
    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listRect.top) list.scrollTop -= listRect.top - optionRect.top;
    else if (optionRect.bottom > listRect.bottom) list.scrollTop += optionRect.bottom - listRect.bottom;
  }, [activeIndex, listId, open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || !rootRef.current?.contains(target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const choose = (option: SearchPickerOption) => {
    onChange(option.id);
    setQuery("");
    setOpen(false);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setQuery("");
        setOpen(true);
        return;
      }
      if (flat.length === 0) return;
      setActiveIndex((index) => (index + 1) % flat.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!open || flat.length === 0) return;
      setActiveIndex((index) => (index - 1 + flat.length) % flat.length);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      setQuery("");
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = flat[activeIndex];
      if (open && option) choose(option);
    }
  };

  let optionIndex = 0;

  return (
    <div ref={rootRef} className={`relative ${open ? "z-30" : ""}`}>
      <AdminIcon icon={Search01Icon} size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5d6043]/70" />
      <input
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={open && flat[activeIndex] ? `${listId}-option-${activeIndex}` : undefined}
        className="w-full rounded-md border border-[#b9aca2] bg-white py-2 pl-9 pr-3 text-sm"
        placeholder={placeholder}
        value={open ? query : selected ? selected.label : ""}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
      />
      {open && (
        <div ref={listRef} id={listId} role="listbox" className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-[#b9aca2] bg-white shadow-lg">
          {options.length === 0 ? (
            <p className="px-3 py-4 text-sm text-[#5d6043]">{emptyLabel}</p>
          ) : flat.length === 0 ? (
            <p className="px-3 py-4 text-sm text-[#5d6043]">{noMatchLabel}</p>
          ) : groups.map((group) => (
            <div key={group.category}>
              <p className="sticky top-0 bg-[#faf9f5] px-3 py-1.5 text-xs font-semibold text-[#5d6043]">{group.category}</p>
              {group.options.map((option) => {
                const index = optionIndex;
                optionIndex += 1;
                const active = index === activeIndex;
                return (
                  <button
                    key={option.id}
                    id={`${listId}-option-${index}`}
                    type="button"
                    role="option"
                    aria-selected={option.id === value}
                    className={`block w-full px-3 py-2 text-left text-sm ${active ? "bg-[#eeeae0]" : "hover:bg-[#faf9f5]"}`}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => choose(option)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
