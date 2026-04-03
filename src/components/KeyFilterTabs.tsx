type KeyFilterTabsProps = {
  keys: string[];
  active: string;
  onChange: (value: string) => void;
};

export default function KeyFilterTabs({ keys, active, onChange }: KeyFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`rounded-full px-3 py-1 text-sm ${
            active === key ? "bg-warm-600 text-white" : "bg-white text-warm-800 border border-warm-200"
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
