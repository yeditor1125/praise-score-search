import { BlogSource } from "../types";

type BlogListProps = {
  blogs: BlogSource[];
  onEdit: (blog: BlogSource) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

export default function BlogList({ blogs, onEdit, onDelete, onToggle }: BlogListProps) {
  return (
    <ul className="space-y-2">
      {blogs.map((blog) => (
        <li key={blog.id} className="rounded-xl border border-warm-200 bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-stone-800">{blog.name}</p>
              <p className="break-all text-xs text-stone-500">{blog.url}</p>
              <p className="mt-1 text-xs uppercase text-stone-400">{blog.type}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md border border-warm-300 px-2 py-1 text-xs" onClick={() => onToggle(blog.id)}>
                {blog.enabled ? "Disable" : "Enable"}
              </button>
              <button className="rounded-md border border-warm-300 px-2 py-1 text-xs" onClick={() => onEdit(blog)}>
                Edit
              </button>
              <button className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-700" onClick={() => onDelete(blog.id)}>
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
