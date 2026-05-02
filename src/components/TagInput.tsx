"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  max?: number;
}

export default function TagInput({ value, onChange, max = 10 }: Props) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!input.trim()) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      const res = await fetch("/api/tags");
      const data = await res.json();
      const q = input.toLowerCase();
      setSuggestions(
        (data.tags as { name: string }[])
          .map((t) => t.name)
          .filter((n) => n.includes(q) && !value.includes(n))
          .slice(0, 8)
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [input, value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function addTag(tag: string) {
    const normalized = tag.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
    if (!normalized || value.includes(normalized) || value.length >= max) return;
    onChange([...value, normalized]);
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(input.trim());
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex flex-wrap gap-1.5 p-2 border border-zinc-300 dark:border-zinc-600 rounded-md min-h-[2.5rem] focus-within:ring-2 focus-within:ring-emerald-500 bg-white dark:bg-zinc-900">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs px-2 py-0.5 rounded-full">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 font-bold leading-none">×</button>
          </span>
        ))}
        {value.length < max && (
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={onKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={value.length === 0 ? "Add tags (press Enter or ,)" : ""}
            className="flex-1 min-w-[8rem] outline-none text-sm bg-transparent placeholder-zinc-400"
          />
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                onMouseDown={(e) => { e.preventDefault(); addTag(s); }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
