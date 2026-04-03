import { SearchItem } from "../types";

type ResultCardProps = {
  item: SearchItem;
};

export default function ResultCard({ item }: ResultCardProps) {
  return (
    <article className="rounded-2xl border border-warm-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-glow">
      <h3 className="line-clamp-2 text-lg font-semibold text-stone-800">{item.title}</h3>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-warm-100 px-3 py-1 text-xs font-semibold text-warm-800">{item.key}</span>
        <span className="text-sm text-stone-500">{item.source}</span>
      </div>
      <a
        className="mt-4 inline-flex rounded-lg bg-warm-600 px-4 py-2 text-sm font-medium text-white hover:bg-warm-700"
        href={item.url}
        target="_blank"
        rel="noreferrer"
      >
        Open Post
      </a>
    </article>
  );
}
