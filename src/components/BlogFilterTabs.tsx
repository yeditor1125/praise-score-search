type BlogFilterTabsProps = {
  blogs: string[];
  active: string;
  onChange: (value: string) => void;
};

export default function BlogFilterTabs({ blogs, active, onChange }: BlogFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {blogs.map((blog) => (
        <button
          key={blog}
          onClick={() => onChange(blog)}
          className={`rounded-full px-3 py-1 text-sm ${
            active === blog ? "bg-warm-600 text-white" : "bg-white text-warm-800 border border-warm-200"
          }`}
        >
          {blog}
        </button>
      ))}
    </div>
  );
}
