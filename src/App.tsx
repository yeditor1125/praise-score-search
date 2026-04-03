import { useMemo, useState } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";
import AdminModal from "./components/AdminModal";
import { defaultSources } from "./constants/defaultSources";
import HomePage from "./pages/HomePage";
import SearchResultPage from "./pages/SearchResultPage";
import { BlogSource } from "./types";
import { localStorageManager } from "./utils/localStorageManager";

export default function App() {
  const [sources, setSources] = useState<BlogSource[]>(() => {
    if (typeof localStorage === "undefined") {
      return defaultSources;
    }
    return localStorageManager.getBlogSources();
  });
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof localStorage === "undefined") {
      return [];
    }
    return localStorageManager.getRecentSearches();
  });
  const [adminOpen, setAdminOpen] = useState(false);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const enabledSources = useMemo(() => sources.filter((source) => source.enabled), [sources]);
  const query = params.get("q") ?? "";

  const goSearch = (nextQuery: string) => {
    const cleaned = nextQuery.trim();
    if (!cleaned) {
      return;
    }
    const nextRecent = localStorageManager.addRecentSearch(cleaned);
    setRecentSearches(nextRecent);
    navigate(`/search?q=${encodeURIComponent(cleaned)}`);
  };

  const updateSources = (next: BlogSource[]) => {
    setSources(next);
    localStorageManager.saveBlogSources(next);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage recentSearches={recentSearches} onSearch={goSearch} onOpenAdmin={() => setAdminOpen(true)} />} />
        <Route
          path="/search"
          element={
            <SearchResultPage
              query={query}
              recentSearches={recentSearches}
              enabledSources={enabledSources}
              onSearch={goSearch}
            />
          }
        />
      </Routes>
      <AdminModal isOpen={adminOpen} blogs={sources} onClose={() => setAdminOpen(false)} onChange={updateSources} />
    </>
  );
}
