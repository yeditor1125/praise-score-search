type EmptyStateProps = {
  query: string;
};

export default function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-warm-300 bg-white p-8 text-center">
      <p className="text-lg font-semibold text-stone-700">No results found</p>
      <p className="mt-2 text-sm text-stone-500">Try another keyword for "{query}".</p>
    </div>
  );
}
