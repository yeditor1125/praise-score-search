import SearchBar from "../components/SearchBar";

type HomePageProps = {
  recentSearches: string[];
  onSearch: (query: string) => void;
  onOpenAdmin: () => void;
};

export default function HomePage({ recentSearches, onSearch, onOpenAdmin }: HomePageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-10">
      <div className="w-full rounded-3xl border border-warm-200 bg-white/75 p-8 text-center shadow-glow backdrop-blur">
        <p className="text-sm tracking-widest text-warm-700">찬양 악보 통합 검색</p>
        <h1 className="mt-2 text-3xl font-bold text-stone-800 sm:text-4xl">자주 쓰는 블로그 악보를 한 번에 검색하세요</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-stone-600">
          찬양 제목으로 검색하고, 키와 블로그별로 결과를 빠르게 필터링할 수 있습니다.
        </p>
        <div className="mt-8 flex justify-center">
          <SearchBar recentSearches={recentSearches} onSearch={onSearch} />
        </div>
        <div className="mt-8">
          <button
            onClick={onOpenAdmin}
            className="rounded-xl border border-warm-300 bg-warm-50 px-4 py-2 text-sm font-medium text-warm-800 hover:bg-warm-100"
          >
            검색 소스 관리
          </button>
        </div>
      </div>
    </main>
  );
}
