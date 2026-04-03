import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogFilterTabs from "../components/BlogFilterTabs";
import EmptyState from "../components/EmptyState";
import KeyFilterTabs from "../components/KeyFilterTabs";
import Loading from "../components/Loading";
import ResultCard from "../components/ResultCard";
import SearchBar from "../components/SearchBar";
import { searchPosts } from "../services/searchApi";
import { BlogSource, SearchItem } from "../types";
import { buildSearchUrl } from "../utils/blog";

type SearchResultPageProps = {
  query: string;
  recentSearches: string[];
  enabledSources: BlogSource[];
  onSearch: (query: string) => void;
};

export default function SearchResultPage({ query, recentSearches, enabledSources, onSearch }: SearchResultPageProps) {
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeKey, setActiveKey] = useState("전체 키");
  const [activeBlog, setActiveBlog] = useState("전체 소스");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    searchPosts(query, enabledSources)
      .then((data) => {
        if (!mounted) {
          return;
        }
        setResults(data);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setError("검색 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      })
      .finally(() => {
        if (!mounted) {
          return;
        }
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [enabledSources, query]);

  useEffect(() => {
    setActiveBlog("전체 소스");
    setActiveKey("전체 키");
  }, [query]);

  const keyOptions = useMemo(() => {
    const set = new Set(results.map((item) => item.key));
    return ["전체 키", ...Array.from(set)];
  }, [results]);

  const blogOptions = useMemo(() => {
    const set = new Set(results.map((item) => item.source));
    return ["전체 소스", ...Array.from(set)];
  }, [results]);

  const filtered = useMemo(() => {
    return results.filter((item) => {
      const keyPass = activeKey === "전체 키" || item.key === activeKey;
      const blogPass = activeBlog === "전체 소스" || item.source === activeBlog;
      return keyPass && blogPass;
    });
  }, [activeBlog, activeKey, results]);

  const exactResults = useMemo(() => filtered.filter((item) => (item.matchType ?? "similar") === "exact"), [filtered]);
  const similarResults = useMemo(
    () => filtered.filter((item) => (item.matchType ?? "similar") === "similar"),
    [filtered]
  );

  return (
    <>
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-warm-200 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-xl font-bold text-stone-800">검색어: "{query}"</h1>
            <button className="text-sm text-warm-700 underline" onClick={() => navigate("/")}>
              Home
            </button>
          </div>
          <SearchBar initialQuery={query} recentSearches={recentSearches} onSearch={onSearch} />
        </div>

        <section className="space-y-4">
          <div className="rounded-2xl border border-warm-200 bg-white/80 p-4">
            <p className="mb-2 text-sm font-semibold text-stone-700">키 필터</p>
            <KeyFilterTabs keys={keyOptions} active={activeKey} onChange={setActiveKey} />
            <p className="mb-2 mt-4 text-sm font-semibold text-stone-700">블로그 필터</p>
            <BlogFilterTabs blogs={blogOptions} active={activeBlog} onChange={setActiveBlog} />
          </div>

          {loading ? <Loading /> : null}
          {error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}
          {!loading && !error && filtered.length === 0 ? <EmptyState query={query} /> : null}

          {!loading && !error && exactResults.length > 0 ? (
            <section>
              <h2 className="mb-3 text-base font-semibold text-stone-800">정확히 일치하는 결과</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {exactResults.map((item) => (
                  <ResultCard key={`${item.url}-${item.title}`} item={item} />
                ))}
              </div>
            </section>
          ) : null}

          {!loading && !error && similarResults.length > 0 ? (
            <section>
              <h2 className="mb-3 text-base font-semibold text-stone-600">비슷한 제목 결과</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {similarResults.map((item) => (
                  <ResultCard key={`${item.url}-${item.title}`} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </section>

        <section className="mt-8 rounded-2xl border border-warm-200 bg-white/80 p-4">
          <h2 className="font-semibold text-stone-800">추가 검색</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={buildSearchUrl(query)}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-warm-100 px-3 py-2 text-sm text-warm-800 hover:bg-warm-200"
            >
              "{query} 악보"로 더 찾아보기
            </a>
            {activeKey !== "전체 키" ? (
              <a
                href={buildSearchUrl(query, `${activeKey} key`)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-warm-100 px-3 py-2 text-sm text-warm-800 hover:bg-warm-200"
              >
                "{query} {activeKey} 악보"로 더 찾아보기
              </a>
            ) : null}
          </div>
        </section>
      </main>

      <button
        onClick={() => navigate("/")}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-warm-600 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-warm-700"
      >
        Home
      </button>
    </>
  );
}
