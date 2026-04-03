import { FormEvent, useMemo, useState } from "react";

type SearchBarProps = {
  initialQuery?: string;
  recentSearches?: string[];
  onSearch: (query: string) => void;
};

export default function SearchBar({ initialQuery = "", recentSearches = [], onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialQuery);

  const suggestions = useMemo(() => {
    if (!value.trim()) {
      return recentSearches.slice(0, 5);
    }
    return recentSearches.filter((item) => item.toLowerCase().includes(value.toLowerCase())).slice(0, 5);
  }, [recentSearches, value]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    if (!q) {
      return;
    }
    onSearch(q);
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={submit} className="rounded-2xl bg-white p-3 shadow-glow">
        <div className="flex gap-3">
          <input
            className="w-full rounded-xl border border-warm-200 px-4 py-3 text-base outline-none transition focus:border-warm-500"
            placeholder="찬양 제목을 입력하세요"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <button
            type="submit"
            className="min-w-[84px] whitespace-nowrap rounded-xl bg-warm-600 px-5 py-3 font-medium text-white transition hover:bg-warm-700"
          >
            검색
          </button>
        </div>
      </form>
      {suggestions.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              className="rounded-full border border-warm-200 bg-white px-3 py-1 text-sm text-warm-700 hover:bg-warm-50"
              onClick={() => {
                setValue(item);
                onSearch(item);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
